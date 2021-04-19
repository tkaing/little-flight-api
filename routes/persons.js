const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/person');
const PersonModel = require('./../models/person');

const router = express.Router();

router.get(
    endpoint.fetch_by_token,
    security.validate_token,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.get_user(request);

                const document = await PersonModel.findById(appUser.id);

                return (document)
                    ? controller.json(response, document)
                    : controller.createNotFound(response);
            }
        );
    }
);

router.post(
    endpoint.sign_up,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { email, username, password } = request.body;

                let document = await PersonModel.findOne({ email: email });

                if (document)
                    return controller.failure(response, 'Un utilisateur avec cet email existe déjà !');

                const person = new PersonModel({
                    email: email,
                    username: username,
                    password: security.encrypt(password)
                });

                await person.save()
                    .then(data => document = data)
                    .catch(failure => controller.failure(response, failure.errors));

                return await security.register_token(response, document.toJSON());
            }
        );
    }
);

router.post(
    endpoint.sign_in,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { email, password } = request.body;

                const document = await PersonModel.findOne({
                    email: email.toLowerCase(),
                    password: security.encrypt(password)
                });

                if (!document)
                    return controller.failure(response, 'L\'email ou le mot de passe est incorrect !');

                return await security.register_token(response, document.toJSON());
            }
        );
    }
);

module.exports = router;
