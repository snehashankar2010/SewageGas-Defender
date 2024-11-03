// Loggers
const logger = require('./config/winston');
global.logger = logger;

const server = require('./config/ws');

// Database
const mongooseConfig = require('./config/mongoose');

const util = require('util');

const request = require('request');

const dotenv = require('dotenv');
dotenv.config();

const start = async () => {
    try {
        // Connect to database
        global.mongo = await mongooseConfig();

        server.listen(process.env.PORT, () => {
            logger.info(
                `HTTP Server started on http://localhost:${process.env.PORT}`
            );
            logger.info(
                `WS Server started on ws://localhost:${process.env.PORT}`
            );
        });
    } catch (err) {
        logger.error(util.inspect(err));
        process.exit(-1);
    }
};

start();
