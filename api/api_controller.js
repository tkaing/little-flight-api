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
    json: (response, data) => response.json(data),
    getUser,
    failure: (response, data, statusCode = 400) => response.status(statusCode).json(data),
    objectId,
    toObjectId,
    createNotFound: (response) => response.status(404).json('404 Not Found.')
}