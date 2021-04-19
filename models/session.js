const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    state: {
        type: String,
        enum: ['ready', 'active', 'finished'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    finishedAt: {
        type: Date
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', schema);