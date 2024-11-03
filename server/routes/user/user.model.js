const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        length: 10,
        match: /^[1-9][0-9]{9}$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 64,
    },
    devices: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Device',
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
