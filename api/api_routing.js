const listOfCollections = require('./api_schema');

// Définit l'ensemble des préfixes / schémas des routes
module.exports = listOfCollections.map((it) => `/${ it }` );
