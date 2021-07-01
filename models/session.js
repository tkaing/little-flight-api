const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    speed: {
        type: String
    },
    duration: {
        type: String
    },
    location: {
        type: String
    },
    createdAt: {
        type: Date
    },
    finishedAt: {
        type: Date
    },
    person: {
        ref: 'Person',
        type: Schema.Types.ObjectId
    }
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', schema);
