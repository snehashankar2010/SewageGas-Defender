/* eslint-disable indent */

const { writeValuesWS } = require('../routes/device/device.controller');

const PayloadTypes = {
    IDENTIFY: 'identify',
    READY: 'ready',
    HELLO: 'hello',
    RESPONSE: 'response',
    WRITE: 'write',
};

const handlePayload = (websocket, payload) => {
    switch (payload.t) {
        case PayloadTypes.IDENTIFY:
            handleIdentifyPayload(websocket, payload);
            break;
        case PayloadTypes.WRITE:
            handleWritePayload(websocket, payload);
            break;
        default:
            logger.error('Unknown payload type: ' + payload.t);
            break;
    }
};

const handleIdentifyPayload = (websocket, payload) => {
    const data = payload.d;

    if (!data || (data && !data.writeKey)) {
        logger.info('Identify Error: Missing writeKey');
        websocket.close();
        return;
    }

    const writeKey = data.writeKey;

    mongo.models.Device.findOne({
        writeKey: writeKey,
    })
        .select(
            'name location description created_at writeKey readKey owner threshold'
        )
        .populate('owner', 'fullname email')
        .then((device) => {
            if (!device) {
                logger.info(`Identiy Error: Invalid writeKey: ${writeKey}`);
                websocket.close();
                return;
            }
            logger.info(
                `Identify Success: Device Connected: ${device.name} (writeKey=${writeKey})`
            );
            websocket.device = device;

            // Send READY payload
            websocket.sendPayload(websocket, PayloadTypes.READY, {
                device,
            });
        })
        .catch((err) => {
            logger.info(`Identify Error: ${err}`);
            websocket.close();
        });
};

const handleWritePayload = async (websocket, payload) => {
    payload = payload.d;
    // Check if authenciated on websocket
    if (!websocket.device) {
        websocket.sendPayload(websocket, PayloadTypes.RESPONSE, {
            message: 'You need to identify before writting.',
        });
        return;
    }
    if (!payload.values || (payload.values && !payload.values.length)) {
        websocket.sendPayload(websocket, PayloadTypes.RESPONSE, {
            message: 'values must be an array.',
        });
        return;
    }
    let values = payload.values;
    let result = await writeValuesWS(websocket.device.writeKey, values);

    if (result && result.error) {
        websocket.sendPayload(websocket, PayloadTypes.RESPONSE, {
            message: result.err,
        });
        return;
    }
};

module.exports = {
    PayloadTypes,
    handlePayload,
};
