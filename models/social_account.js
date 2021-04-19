const mongoose = require('mongoose');
const SocialAccountProviderEnum = require('../utils/enums/social_account_provider');

const Schema = mongoose.Schema;

const schema = new Schema({
    provider: {
        type: String,
        enum: [
            SocialAccountProviderEnum.GOOGLE,
            SocialAccountProviderEnum.FACEBOOK
        ],
        required: true
    },
    uniqueId: {
        type: String,
        required: true
    }
}, { collection: 'social_accounts' });

module.exports = mongoose.model('SocialAccount', schema);