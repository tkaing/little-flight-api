const mongoose = require('mongoose');
const validation = require('./../api/api_validation');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: [
            validation.email.validate,
            validation.email.message()
        ],
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 2,
        maxLength: 20,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        minLength: 4
    },
    provider: {
        type: String,
        enum: ['google', 'twitch']
    },
    friends: [{ type : ObjectId, ref: 'Person' }]
}, { collection: 'persons' });

module.exports = mongoose.model('Person', schema);
