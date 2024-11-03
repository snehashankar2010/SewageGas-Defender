const express = require('express');
const { decryptToken } = require('../auth/auth.controller');
const deviceCtrl = require('./device.controller');

// Validation
const { validate } = require('express-validation');
const paramValidation = require('../../config/paramValidation');

const router = express.Router();

router
    .route('/')
    // GET /
    .get(decryptToken, deviceCtrl.getAll)
    // POST /
    .post(
        validate(paramValidation.addDevice, {}, { abortEarly: false }),
        decryptToken,
        deviceCtrl.addDevice
    );

// GET /:deviceId
router
    .route('/:deviceId')
    .get(
        validate(paramValidation.getDevice, {}, { abortEarly: false }),
        decryptToken,
        deviceCtrl.get
    );

// DELETE /:deviceId
router
    .route('/:deviceId')
    .delete(
        validate(paramValidation.deleteDevice, {}, { abortEarly: false }),
        decryptToken,
        deviceCtrl.deleteDevice
    );

// POST /:deviceId/write
router
    .route('/:deviceId/write/:writeKey')
    .post(
        validate(paramValidation.writeValues, {}, { abortEarly: false }),
        deviceCtrl.writeValues
    );

// GET /:deviceId/read
router
    .route('/:deviceId/read/:readKey')
    .get(
        validate(paramValidation.readValues, {}, { abortEarly: false }),
        deviceCtrl.readValues
    );

module.exports = router;
