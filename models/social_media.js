const mongoose = require('mongoose');
const SocialMediaProviderEnum = require('../utils/enums/social_media_provider');

const Schema = mongoose.Schema;

const schema = new Schema({
    provider: {
        type: String,
        enum: [
            SocialMediaProviderEnum.TWITCH,
            SocialMediaProviderEnum.YOUTUBE
        ],
        required: true
    },
    uniqueId: {
        type: String,
        required: true
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }
}, { collection: 'social_medias' });

module.exports = mongoose.model('SocialMedia', schema);