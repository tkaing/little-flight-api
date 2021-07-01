const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    subject: {
        type: String
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    },
    description: {
        type: String
    },
    person: {
        ref: 'Person',
        type: Schema.Types.ObjectId
    }
}, { collection: 'reports' });

module.exports = mongoose.model('Report', schema);
