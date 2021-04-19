const express = require("express");

const manager = require('./../api/api_manager');
const security = require('./../api/api_security');
const validation = require('./../api/api_validation');

const endpoints = require('./../endpoints/persons');
const PersonModel = require('./../models/person');

const router = express.Router();

router.get(
    endpoints.fetch_by_token,
    security.validate_token,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const appUser = await manager.getUser(request);

                const document = await PersonModel.findById(appUser.id);

                return (document)
                    ? response.json(document)
                    : response.status(404).json(validation.NotFound);
            }
        );
    }
);

router.post(
    endpoints.sign_up,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const { username, password } = request.body;

                let document = await PersonModel.findOne({ username: username });

                if (document)
                    return response.status(403).json('Un utilisateur avec cet identifiant existe déjà !');

                const person = new PersonModel({
                    username: username,
                    password: security.encrypt(password)
                });

                await person.save()
                    .then(result => document = result)
                    .catch(failure => response.status(400).json(failure.errors));

                return await security.register_token(response, document.toJSON());
            }
        );
    }
);

router.post(
    endpoints.sign_in,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const { username, password } = request.body;

                const document = PersonModel.findOne({
                    username: username.toLowerCase(),
                    password: security.encrypt(password)
                });

                if (!document)
                    return response.status(404).json('L\'identifiant ou le mot de passe est incorrect !');

                return await security.register_token(response, document.toJSON());
            }
        );
    }
);

module.exports = router;
