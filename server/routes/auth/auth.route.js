const express = require('express');
const authCtrl = require('./auth.controller');

// Validation
const { validate } = require('express-validation');
const paramValidation = require('../../config/paramValidation');

const router = express.Router();

// DELETE /auth
router.route('/').delete(authCtrl.decryptToken, authCtrl.deleteUser);

// POST /auth/login
router
    .route('/login')
    .post(
        validate(paramValidation.login, {}, { abortEarly: false }),
        authCtrl.login
    );

router
    .route('/signup')
    .post(
        validate(paramValidation.signup, {}, { abortEarly: false }),
        authCtrl.signup
    );

router
    .route('/token')
    .post(
        validate(paramValidation.token, {}, { abortEarly: false }),
        authCtrl.token
    );

module.exports = router;
