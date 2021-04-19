const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }
}, { collection: 'sessions_metadata' });

module.exports = mongoose.model('SessionMetadata', schema);