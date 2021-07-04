const security = require('./api_security');
const { param } = require('express-validator');
const { ObjectId } = require('mongodb');

const getUser = async (request) => {
    const appUser = await security.formattedToken(request);
    return { id: ObjectId(appUser._id) };
};

const objectId = () => param('id').customSanitizer(id => ObjectId(id));

const toObjectId = (_id) => ObjectId(_id);

module.exports = {
    // Retourne une réponse de succès (status=200)
    json: (response, data) => response.json(data),
    // Récupère l'ObjectId de l'utilisateur enregistré par le token
    getUser,
    // Retourne une réponse d'erreur (status=4xx)
    failure: (response, data, statusCode = 400) => response.status(statusCode).json(data),
    // Transforme le paramètre id de l'url en ObjectId
    objectId,
    // Transforme un id en ObjectId
    toObjectId,
    // Retourne une réponse d'erreur NOT FOUND (status=404)
    createNotFound: (response) => response.status(404).json('404 Not Found.')
}
