const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    source: {
        type: String,
        enum: ['photo', 'video', 'live'],
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