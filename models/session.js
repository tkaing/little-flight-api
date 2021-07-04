const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    time: {
        type: String
    },
    temp: {
        type: String
    },
    battery: {
        type: String
    },
    createdAt: {
        type: Date
    },
    person: {
        ref: 'Person',
        type: Schema.Types.ObjectId
    }
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', schema);
