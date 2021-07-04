const mongoose = require('mongoose');
const validation = require('./../api/api_validation');
const { ObjectId } = require('mongodb');

const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: [
            validation.email.validate,
            validation.email.message()
        ],
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 2,
        maxLength: 20,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        minLength: 4
    },
    // Les dronies cumulés de l'utilisateur
    dronies: {
        type: Number,
        required: true
    },
    // Permet de savoir si l'utilisateur s'est inscrit via Google Connect
    provider: {
        type: String,
        enum: ['google']
    },
}, { collection: 'persons' });

module.exports = mongoose.model('Person', schema);
