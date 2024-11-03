const User = require('./user.model');
const APIError = require('../../helpers/APIError');

function get(req, res, next) {
    User.findById(req.user._id)
        // except the values field
        .populate('devices', '-values')
        .then((user) => {
            user.password = undefined;
            return res.json({
                success: true,
                user,
            });
        })
        .catch((e) => {
            if (e.name === 'CastError') {
                return next(new APIError('User not found', 404, true));
            } else return next(new APIError(e.message, e.status, false));
        });
}

module.exports = { get };
