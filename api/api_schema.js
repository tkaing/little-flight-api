const listOfCollections = [
    'persons'
];

module.exports = {
    routes: listOfCollections.map((it) => `/${ it }` )
};