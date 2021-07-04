const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    // Celui ayant fait la demande d'ami
    requestBy: {
        ref: 'Person',
        type: ObjectId,
        required: true
    },
    // Celui ayant reçu la demande d'ami
    requestTo: {
        ref: 'Person',
        type : ObjectId,
        required: true
    },
    // Statut de la demande
    isAccepted: {
        type: Boolean,
        default: false
    }
}, { collection: 'friends' });

module.exports = mongoose.model('Friend', schema);
