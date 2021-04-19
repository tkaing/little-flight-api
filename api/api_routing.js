const listOfCollections = require('./api_schema');

module.exports = listOfCollections.map((it) => `/${ it }` );