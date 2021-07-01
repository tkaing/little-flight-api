const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    requestBy: {
        ref: 'Person',
        type: ObjectId,
        required: true
    },
    requestTo: {
        ref: 'Person',
        type : ObjectId,
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
}, { collection: 'friends' });

module.exports = mongoose.model('Friend', schema);
