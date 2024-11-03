const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../../helpers/APIError');

const User = require('../user/user.model');
const Device = require('../device/device.model');

const util = require('util');

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.devices.length > 0) {
            await Promise.all(
                user.devices.map((deviceId) =>
                    Device.findByIdAndDelete(deviceId).catch((er) => {})
                )
            );
        }
        await User.findByIdAndDelete(user._id);
        res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new APIError('User not found', 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
};

const login = (req, res, next) => {
    const error = new APIError(
        'Authentication error',
        httpStatus.UNAUTHORIZED,
        true
    );

    User.findOne({ email: req.body.email })
        .populate('devices', '-values')
        .then((user) => {
            if (!user) {
                throw error;
            }

            if (!passwordEquals(user.password, req.body.password)) {
                throw error;
            }

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '14d',
            });
            user.password = undefined;
            return res.status(200).json({
                success: true,
                token,
                user,
            });
        })
        .catch((e) => {
            next(error);
        });
};

const signup = (req, res, next) => {
    // check if user with same email exists
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return next(
                new APIError(
                    'User already exists',
                    httpStatus.BAD_REQUEST,
                    true
                )
            );
        }
    });

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword,
    });

    user.save()
        .then((savedUser) => {
            // remove password before sending the saved user object
            savedUser.password = undefined;
            res.json({
                success: true,
                user: savedUser,
            });
        })
        .catch((e) => next(e));
};

const token = (req, res, next) => {
    const gotToken = req.body.token;

    jwt.verify(gotToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error('JWT ERROR: ' + util.inspect(err));
            return next(
                new APIError('Invalid Token', httpStatus.BAD_REQUEST, true)
            );
        }

        if (!decoded._id) return next(new APIError('Invalid Token', 401, true));

        User.findOne({ _id: decoded._id })
            .populate('devices', '-values')
            .then((foundUser) => {
                if (!foundUser)
                    return next(new APIError('Invalid token', 401, true));
                foundUser.password = undefined;
                return res.status(200).json({
                    success: true,
                    user: foundUser,
                });
            });
    });
};

const decryptToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    let showError = true;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        if (bearer.length >= 2) {
            const bearerToken = bearer[1];
            // decrypt the token
            jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    logger.error('JWT ERROR: ' + util.inspect(err));
                    return;
                }
                showError = false;
                req.user = decoded;

                return next();
            });
        }
    }

    // Check if token is present in the body instead of headers
    if (req.body && req.body.token) {
        jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                logger.error('JWT ERROR: ' + util.inspect(err));
                return;
            }
            showError = false;
            req.user = decoded;
            return next();
        });
    }

    if (showError)
        return next(
            new APIError(
                'Unauthorized: Invalid Token',
                httpStatus.UNAUTHORIZED,
                true
            )
        );
};

function passwordEquals(hashedPassword, normalPassword) {
    return bcrypt.compareSync(normalPassword, hashedPassword);
}

module.exports = { login, signup, token, decryptToken, deleteUser };
