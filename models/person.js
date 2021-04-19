const mongoose = require('mongoose');
const validation = require('./../api/api_validation');

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
        required: true,
        minLength: 4
    },
    socialAccount: {
        type: Schema.Types.ObjectId,
        ref: 'SocialAccount',
        required: false
    }
}, { collection: 'persons' });

module.exports = mongoose.model('Person', schema);