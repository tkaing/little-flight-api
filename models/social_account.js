const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    provider: {
        type: String,
        enum: ['facebook', 'google'],
        required: true
    },
    uniqueId: {
        type: String,
        required: true
    }
}, { collection: 'social_accounts' });

module.exports = mongoose.model('SocialAccount', schema);