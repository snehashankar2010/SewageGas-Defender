const Joi = require('joi');

module.exports = {
    // POST /api/auth/signup
    signup: {
        body: Joi.object({
            email: Joi.string().required().min(5).max(50).trim(),
            password: Joi.string().required().min(6).max(50),
            fullname: Joi.string().required().min(5).max(50),
            phone: Joi.string().required().length(10),
        }),
    },

    // POST /api/auth/login
    login: {
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        }),
    },

    // POST /api/auth/token
    token: {
        body: Joi.object({
            token: Joi.string().required(),
        }),
    },

    // POST /api/user/device
    addDevice: {
        body: Joi.object({
            name: Joi.string().required().min(3).max(50).trim(),
            location: Joi.string().max(64).trim(),
            description: Joi.string().max(160).trim(),
            threshold: Joi.number().max(100).min(0),
        }),
    },

    // GET /api/user/device/:deviceId
    getDevice: {
        params: Joi.object({
            deviceId: Joi.string()
                .required()
                .regex(/^[0-9a-fA-F]{24}$/),
        }),
    },

    // DELETE /api/user/device/:deviceId
    deleteDevice: {
        params: Joi.object({
            deviceId: Joi.string()
                .required()
                .regex(/^[0-9a-fA-F]{24}$/),
        }),
    },

    writeValues: {
        params: Joi.object({
            deviceId: Joi.string()
                .required()
                .regex(/^[0-9a-fA-F]{24}$/),
            writeKey: Joi.string().required(),
        }),
        body: Joi.object({
            values: Joi.array().required(),
        }),
    },

    readValues: {
        params: Joi.object({
            deviceId: Joi.string()
                .required()
                .regex(/^[0-9a-fA-F]{24}$/),
            readKey: Joi.string().required(),
        }),
    },
};
