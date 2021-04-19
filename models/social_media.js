const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    provider: {
        type: String,
        enum: ['twitch', 'youtube'],
        required: true
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }
}, { collection: 'social_medias' });

module.exports = mongoose.model('SocialMedia', schema);