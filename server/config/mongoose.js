const mongoose = require('mongoose');
const util = require('util');

module.exports = () =>
    new Promise(async (resolve, reject) => {
        try {
            mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            mongoose.connection.on('error', (error) => {
                logger.error('MongoDB Error: ' + util.inspect(error, 3));
            });

            // mongoose.set('debug', (collectionName, method, query, doc) => {
            //     logger.debug(
            //         `${collectionName}.${method}`,
            //         util.inspect(query, false, 20),
            //         doc
            //     );
            // });

            logger.info('Connected to database.');

            resolve(mongoose.connection);
        } catch (err) {
            reject(err);
        }
    });
