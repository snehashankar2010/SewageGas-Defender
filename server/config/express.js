const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { UnauthorizedError } = require('express-jwt');
const expressValidation = require('express-validation');

const routes = require('../routes');
const path = require('path');
const logger = require('./winston');
const util = require('util');

const app = express();

const { httpLoggerMiddleware } = require('./winston');
app.use(httpLoggerMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
    ],
    credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use('/api', routes);
app.use(express.static('public'));

// Catch error and convert to APIError
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        // Validation error contains errors which is an array of error each containing message[]
        const unifiedErrors = [];
        if (err.details.params) unifiedErrors.push(...err.details.params);
        if (err.details.body) unifiedErrors.push(...err.details.body);

        const unifiedErrorMessage = unifiedErrors
            .map((error) => error.message)
            .join(' and ');

        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    } else if (!(err instanceof APIError)) {
        // Check if its an invalid token error
        if (err instanceof UnauthorizedError) {
            return next(
                new APIError(
                    'Unauthorized: Invalid token',
                    httpStatus.UNAUTHORIZED,
                    true
                )
            );
        }
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
    }
    return next(err);
});

// Catch APIError
app.use((err, req, res, next) => {
    let statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message;
    if (!err.isPublic) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;

    const errorResponse = {
        code: statusCode,
        message,
        success: false,
    };
    logger.error('APIError: ' + util.inspect(err));
    res.status(statusCode).json(errorResponse);
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});
module.exports = app;
