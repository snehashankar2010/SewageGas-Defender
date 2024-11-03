const RETURN_VALUES_LIMIT = 1000;
const ARRAY_SIZE_LIMIT = 600000;
const NOTIFICATION_COOLDOWN = 2 * 60 * 1000; // 2mins
const TEST_DEVICE_ID = '625b04430d78e5a9532cc085';

const axios = require('axios');
const crypto = require('crypto');

const User = require('../user/user.model');
const Device = require('./device.model');
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function getAll(req, res, next) {
    User.findById(req.user._id)
        .populate('devices')
        .then((user) => {
            return res.json({
                success: true,
                devices: user.devices,
            });
        })
        .catch((e) => {
            if (e.name === 'CastError') {
                return next(new APIError('User not found', 404, true));
            } else return next(new APIError(e.message, e.status, false));
        });
}

async function get(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (
            !user.devices.some(
                (device) => device && device.toString() === req.params.deviceId
            )
        ) {
            return next(
                new APIError(
                    // eslint-disable-next-line quotes
                    "You don't own this device.",
                    httpStatus.FORBIDDEN,
                    true
                )
            );
        }

        const device = await Device.findById(req.params.deviceId).slice(
            'values',
            //RETURN_VALUES_LIMIT
            -250 // return the latest 250 values
        );

        return res.status(200).json({
            success: true,
            device,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new APIError('User not found', 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
}

async function addDevice(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        const device = new Device({
            ...req.body,
            writeKey: crypto.randomBytes(16).toString('hex'),
            readKey: crypto.randomBytes(16).toString('hex'),
            owner: req.user._id,
        });

        await device.save();
        user.devices.push(device._id);
        await user.save();

        return res.json({
            success: true,
            device,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new APIError('User not found', 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
}

async function deleteDevice(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (
            !user.devices.some(
                (device) => device && device.toString() === req.params.deviceId
            )
        ) {
            return next(
                new APIError(
                    // eslint-disable-next-line quotes
                    "You don't own this device.",
                    httpStatus.FORBIDDEN,
                    true
                )
            );
        }

        const device = await Device.findById(req.params.deviceId).select(
            '-values'
        );

        if (!device) return next(new APIError('Device not found', 404, true));

        // TODO: remove this for production
        if (device._id == TEST_DEVICE_ID)
            return next(
                new APIError(
                    'Cannot delete testing device.',
                    httpStatus.FORBIDDEN,
                    true
                )
            );

        await User.updateOne(
            {
                _id: req.user._id,
            },
            {
                $pull: {
                    devices: device._id,
                },
            }
        );

        await Device.deleteOne({ _id: device._id });

        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new APIError('User not found', 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
}

async function writeValuesWS(writeKey, values) {
    try {
        const device = await Device.findOne({
            writeKey,
        }).select('-values');
        if (!device) return { error: 'Device not found' };

        let sentNotification = false;
        let vals = await Promise.all(
            values.map(async (val) => {
                return {
                    value: val,
                    date: new Date(),
                };
            })
        );
        await Device.findByIdAndUpdate(device._id, {
            $push: {
                values: {
                    $each: vals,
                    $slice: -ARRAY_SIZE_LIMIT,
                },
            },
        });
        if (sentNotification) await device.save();
    } catch (err) {
        logger.error('writeValesWS Error' + err.toString());
    }
}

async function writeValues(req, res, next) {
    try {
        const device = await Device.findById(req.params.deviceId).select(
            '-values'
        );
        if (!device) return next(new APIError('Device not found', 404, true));

        if (device.writeKey !== req.params.writeKey)
            return next(new APIError('Invalid write key', 403, true));
        if (req.body.values.length === 0)
            return next(new APIError('No values to write', 400, true));

        if (req.body.date) req.body.date = undefined;

        let sentNotification = false;
        let vals = await Promise.all(
            req.body.values.map(async (val) => {
                if (val >= device.threshold) {
                    logger.info(
                        `Threshold value of ${device.threshold} is crossed! Received value ${val}!`
                    );
                }
                return {
                    value: val,
                    date: new Date(),
                };
            })
        );
        await Device.findByIdAndUpdate(req.params.deviceId, {
            $push: {
                values: {
                    $each: vals,
                    $slice: -ARRAY_SIZE_LIMIT,
                },
            },
        });
        if (sentNotification) await device.save();

        res.status(200).json({
            success: true,
        });
    } catch (err) {
        return next(new APIError(err.message, err.status, false));
    }
}

async function readValues(req, res, next) {
    try {
        const device = await Device.findById(req.params.deviceId).select(
            '-values'
        );

        if (!device) return next(new APIError('Device not found', 404, true));

        if (device.readKey !== req.params.readKey)
            return next(new APIError('Invalid read key', 403, true));

        let limit = req.query.limit
            ? Math.min(parseInt(req.query.limit), RETURN_VALUES_LIMIT)
            : RETURN_VALUES_LIMIT;
        let skip = req.query.skip ? parseInt(req.query.skip) : 0;

        if (limit < 0) limit = 0;
        if (limit > RETURN_VALUES_LIMIT) limit = RETURN_VALUES_LIMIT;

        const { values } = await Device.findById(req.params.deviceId)
            .select(
                'values -name -description -location -writeKey -readKey -created_at'
            )
            .slice('values', [skip, limit]);

        // Check if device is connected in realtime to the websocket server
        let ws = getWSByWriteKey(device.writeKey);
        let isConnected = false;
        if (ws) {
            isConnected = ws.isAlive;
        }

        res.status(200).json({
            success: true,
            values,
            isConnected,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new APIError('User not found', 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
}

module.exports = {
    getAll,
    get,
    addDevice,
    writeValues,
    writeValuesWS,
    readValues,
    deleteDevice,
};
