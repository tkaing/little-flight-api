const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    // Objet du rapport
    subject: {
        type: String
    },
    // Statut du rapport
    isClosed: {
        type: Boolean,
        default: false
    },
    // Date à laquelle le rapport a été créé
    createdAt: {
        type: Date
    },
    // Description
    description: {
        type: String
    },
    // Utilisateur ayant ouvert le rapport
    person: {
        ref: 'Person',
        type: Schema.Types.ObjectId
    }
}, { collection: 'reports' });

module.exports = mongoose.model('Report', schema);
