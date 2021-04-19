const security = require('./api_security');
const { param } = require('express-validator');
const { ObjectId } = require('mongodb');

const get_user = async (request) => {

    const appUser = await security.formatted_token(request);

    return { id: ObjectId(appUser._id) };
};

const object_id = () => param('id').customSanitizer(id => ObjectId(id));

module.exports = {
    json: (response, data) => response.json(data),
    get_user,
    failure: (response, data, statusCode = 400) => response.status(statusCode).json(data),
    object_id,
    createNotFound: (response) => response.status(404).json('404 Not Found.')
}