const express = require("express");

const schema = require('./../api/api_schema');
const mongodb = require('./../api/api_mongodb');
const security = require('./../api/api_security');
const validator = require('./../api/api_validator');

const endpoints = require('./../api/endpoints/persons');
const constraints = require('./../api/constraints/persons');

const router = express.Router();
const collection = schema.persons;

router.get(
    endpoints.fetch_by_token,
    security.validate_token,
    async (request, response) => {
        return mongodb.exec(
            request, response, async (client) => {
                const token = await security.formatted_token(request);
                const finder_persons = mongodb.collection(client, collection);
                const document = await finder_persons.findOne({ _id: mongodb._id(token._id) });
                return response.json(document);
            }
        );
    }
);

router.post(
    endpoints.sign_up,
    constraints.default,
    validator.validate_body,
    async (request, response) => {
        return mongodb.exec(
            request, response, async (client) => {

                const { username, password } = request.body;
                const finder_persons = mongodb.collection(client, collection);

                let document = await finder_persons.findOne({ username: username.toLowerCase() });

                if (document)
                    return response.status(403).json('Un utilisateur avec cet identifiant existe déjà !');

                let result = await finder_persons.insertOne({
                    username: username.toLowerCase(),
                    password: security.encrypt(password)
                });

                return security.register_token(response, result.ops[0]);
            }
        );
    }
);

router.post(
    endpoints.sign_in,
    constraints.default,
    validator.validate_body,
    async (request, response) => {
        return mongodb.exec(
            request, response, async (client) => {

                const { username, password } = request.body;
                const finder_persons = mongodb.collection(client, collection);

                let document = finder_persons.findOne({
                    username: username.toLowerCase(),
                    password: security.encrypt(password)
                });

                if (!document)
                    return response.status(404).json('L\'identifiant ou le mot de passe est incorrect !');

                return security.register_token(response, document);
            }
        );
    }
);

module.exports = router;
