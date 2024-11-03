const { Router } = require('express');
const router = Router();

const httpStatus = require('http-status');
const APIError = require('./helpers/APIError');

// Base API endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Realtime Sewage Gas Detection & Neutralization API is online',
    });
});

// Load all *.route.js files in routes folder using glob
const glob = require('glob');
const routeFiles = glob.sync('./routes/**/*.route.js');
routeFiles.forEach((routePath) => {
    const routeName = routePath.split('/').pop().replace('.route.js', '');
    router.use(`/${routeName}`, require(routePath));
});

//API 404 Handler
router.all('*', (req, res, next) => {
    const err = new APIError(
        'API Endpoint Not Found',
        httpStatus.NOT_FOUND,
        true
    );
    return next(err);
});

module.exports = router;
