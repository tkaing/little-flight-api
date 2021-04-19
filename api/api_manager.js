const schema = require('./api_schema');
const security = require('./api_security');

const mongoose = require('mongoose');
const { param } = require('express-validator');
const { ObjectId } = require('mongodb');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'api-little-flight';

const _id = (id) => ObjectId(id);

const exec = async (request, response, callback) => {

    const routes = schema.routes;
    const baseUrl = request.baseUrl;
    const routeIndex = routes.findIndex((it) => it === baseUrl);

    if (routeIndex === -1)
        return response.status(404).json('Collection introuvable.');

    try {
        await mongoose.connect(`${ URI }/${ DB_NAME }`, { useNewUrlParser: true, useUnifiedTopology: true });
        return await callback();
    } catch (e) {
        return response.status(500).json(e.stack);
    }
};

const getUser = async (request) => {

    const appUser = await security.formatted_token(request);

    return {
        id: _id(appUser._id)
    };
};

const param_id = () => param('id').customSanitizer(id => _id(id));

const collection = (client, name) => {
    const dbi = client.db(DB_NAME);
    return dbi.collection(name);
};

module.exports = {
    _id,
    exec,
    getUser,
    param_id,
    collection,

    fetch_one: async (criteria = {}) => {
        await collection.findOne(criteria);
    },
    fetch_list: async (criteria = {}) => {
        await collection.find(criteria).toArray();
    },
    insert_one: async (document) => {
        await collection.insertOne(document);
    },
    update_one: async (filter, document) => {
        await collection.updateOne(filter, document);
    },
    delete_one: async (filter) => {
        await collection.deleteOne(filter);
    }
};