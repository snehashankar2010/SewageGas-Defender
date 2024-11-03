const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    location: {
        type: String,
        maxLength: 64,
    },
    description: {
        type: String,
        maxLength: 160,
    },
    writeKey: {
        type: String,
        required: true,
        minlength: 16,
    },
    readKey: {
        type: String,
        required: true,
        minlength: 16,
    },
    values: [
        {
            type: Schema.Types.Mixed,
        },
    ],
    threshold: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    lastNotification: {
        type: Date,
        default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;
