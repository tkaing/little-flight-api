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
    // Date à laquelle la session a été créé
    createdAt: {
        type: Date
    },
    // Utilisateur ayant lancé la session
    person: {
        ref: 'Person',
        type: Schema.Types.ObjectId
    }
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', schema);
