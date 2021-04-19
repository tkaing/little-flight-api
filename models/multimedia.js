const mongoose = require('mongoose');
const MultimediaSourceEnum = require('../utils/enums/multimedia_source');

const Schema = mongoose.Schema;

const schema = new Schema({
    source: {
        type: String,
        enum: [
            MultimediaSourceEnum.LIVE,
            MultimediaSourceEnum.VIDEO,
            MultimediaSourceEnum.PHOTO
        ],
        required: true
    },
    path: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }
}, { collection: 'multimedias' });

module.exports = mongoose.model('Multimedia', schema);