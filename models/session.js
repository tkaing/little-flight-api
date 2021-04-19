const mongoose = require('mongoose');
const SessionStateEnum = require('../utils/enums/session_state');

const Schema = mongoose.Schema;

const schema = new Schema({
    state: {
        type: String,
        enum: [
            SessionStateEnum.CREATED,
            SessionStateEnum.READY,
            SessionStateEnum.ACTIVE,
            SessionStateEnum.FINISHED
        ],
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