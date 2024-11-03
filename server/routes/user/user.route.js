const express = require('express');
const { decryptToken } = require('../auth/auth.controller');
const userCtrl = require('./user.controller');

// Validation
const { validate } = require('express-validation');
const paramValidation = require('../../config/paramValidation');

const router = express.Router();

// GET /
router.route('/').get(decryptToken, userCtrl.get);

module.exports = router;
