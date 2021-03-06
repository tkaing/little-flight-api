const mongoose = require('mongoose');
const listOfRoutes = require('./api_routing');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'little-flight-api';

const execute = async (request, response, callback) => {

    const baseUrl = request.baseUrl;
    const routeIndex = listOfRoutes.findIndex((it) => it === baseUrl);

    if (routeIndex === -1)
        return response.status(404).json('Collection introuvable.');

    try {
        await mongoose.connect(`${ URI }/${ DB_NAME }`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        return await callback();
    } catch (e) {
        console.log(e);
        return response.status(500).json(e);
    }
};

module.exports = {
    // Exécute un callback (logique du code) à partir d'une instance Mongoose
    execute
};
