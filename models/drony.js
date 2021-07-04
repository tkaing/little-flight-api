const mongoose = require('mongoose');
const validation = require('../api/api_validation');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    // Object de la transaction
    subject: {
        type: String,
        enum: ['SEND', 'BUY'],
        required: true,
    },
    // Montant des dronies envoyés ou achetés
    amount: {
        type: Number,
        required: true,
    },
    // Date à laquelle la transaction a été réalisée
    createdAt: {
        type: Date,
        required: true,
    },
    // Celui qui envoie les dronies
    sender: {
        ref: 'Person',
        type : ObjectId,
        required: true
    },
    // Celui qui reçoit les dronies
    adressee: {
        ref: 'Person',
        type : ObjectId,
        required: true
    }
}, { collection: 'dronies' });

module.exports = mongoose.model('Drony', schema);
