const schema = require('./api_schema');
const { MongoClient, ObjectId } = require('mongodb');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'api-little-flight';

const _id = (id) => ObjectId(id);

const exec = async (request, response, callback) => {

    const baseUrl = request.baseUrl;
    const listOfRoutes = schema.list.map((it) => `/${ it }`);
    const routeIndex = listOfRoutes.findIndex((it) => it === baseUrl);

    if (routeIndex === -1)
        return response.status(404).json('Collection introuvable.');

    try {
        const client = new MongoClient(URI, { useUnifiedTopology: true });
        await client.connect();
        const finalResponse = await callback(client);
        await client.close();
        return finalResponse;
    } catch (e) {
        return response.status(400).json(e.stack);
    }
};


const collection = (client, name) => {
    const dbi = client.db(DB_NAME);
    return dbi.collection(name);
};

module.exports = {
    _id, exec,
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