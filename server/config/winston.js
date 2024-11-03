const { format, createLogger, transports } = require('winston');

const myformat = format.combine(
    format.colorize(),
    format.align(),
    format.printf((info) => `${info.level}: ${info.message}`)
);

const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            colorize: true,
            format: myformat,
        }),
    ],
});

const httpLoggerMiddleware = (req, res, next) => {
    res.on('finish', () => {
        const message = [
            res.statusCode,
            req.method,
            req.originalUrl,
            req.ip,
        ].join(' ');

        if (res.statusCode >= 400) {
            logger.error(`HTTP ERROR ${message}`);
        } else {
            logger.debug(`HTTP OK ${message}`);
        }
    });

    next();
};

// Default export: logger
module.exports = logger;
exports = module.exports;

// Named export
exports.httpLoggerMiddleware = httpLoggerMiddleware;
