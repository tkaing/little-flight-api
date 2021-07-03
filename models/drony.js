const mongoose = require('mongoose');
const validation = require('../api/api_validation');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    subject: {
        type: String,
        enum: ['SEND', 'BUY'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    sender: {
        ref: 'Person',
        type : ObjectId,
        required: true
    },
    adressee: {
        ref: 'Person',
        type : ObjectId,
        required: true
    }
}, { collection: 'dronies' });

module.exports = mongoose.model('Drony', schema);
