/* eslint-disable indent */
const ws = require('ws');
const { handlePayload, PayloadTypes } = require('../gateway/payload');
const server = require('http').createServer();
const app = require('./express');
const logger = require('./winston');

const wss = new ws.Server({
    server,
});

const getWSByWriteKey = (writeKey) => {
    let found = null;
    wss.clients.forEach((client) => {
        if (client.device && client.device.writeKey == writeKey) {
            found = client;
            return;
        }
    });
    return found;
};

function heartbeat() {
    this.isAlive = true;
}

const sendPayload = (websocket, type, data) => {
    let request = {
        t: type,
        d: data,
    };
    websocket.send(JSON.stringify(request));
};

// Mount http (Express) app
server.on('request', app);

wss.on('connection', function connection(ws) {
    logger.info('Got WS connection');
    ws.isAlive = true;
    ws.sendPayload = sendPayload;
    ws.on('pong', heartbeat);

    // Send HELLO Payload
    sendPayload(ws, PayloadTypes.HELLO, {});
    // Start a timer to wait for IDENTIFY payload
    setTimeout(() => {
        if (ws.readyState == ws.OPEN && !ws.device) {
            logger.info("Identify Error: Client didn't send IDENTIFY");
            ws.close();
            return;
        }
    }, 10000);

    ws.on('message', (message) => {
        message = String(message);
        try {
            let payload = JSON.parse(message);
            if (!payload['d'] || !payload['t']) {
                logger.error('Invalid payload: ' + payload);
                ws.close();
                return;
            }
            let data = {
                t: payload['t'],
                d: payload['d'],
            };
            handlePayload(ws, data);
        } catch (err) {
            ws.close();
            logger.error('Error parsing message: ', err);
        }
    });

    ws.on('close', () => {
        logger.info('WS: Client Disconnected');
        ws.writeKey = undefined;
    });
    ws.on('error', () => {
        ws.terminate();
        logger.info('WS: Client Error');
    });
});

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive == false) {
            ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 15000);

wss.on('close', () => {
    clearInterval(interval);
});

module.exports = server;

global.getWSByWriteKey = getWSByWriteKey;
