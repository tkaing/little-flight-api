const express = require("express");
const googleApi = require('googleapis').google;

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/person');
const PersonModel = require('./../models/person');

const OAuth2 = googleApi.auth.OAuth2;
const router = express.Router();

router.get(
    endpoint.list,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {
                return controller.json(response, (await PersonModel.find()))
            }
        );
    }
);

router.get(
    endpoint.fetch_by_token,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                // Récupère l'utilisateur enregistré par le token
                const appUser = await controller.getUser(request);
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
                const personFromDb = await PersonModel.findOne({ email: email });

                // Vérifie que l'utilisateur n'existe pas
                if (personFromDb)
                    return controller.failure(response, 'Un utilisateur avec cet email existe déjà !');

                // Ajoute un utilisateur dans la base
                const person = await (
                    new PersonModel({
                        email: email,
                        username: username,
                        password: security.encrypt(password),
                        dronies: 0
                    })
                ).save();

                return await security.registerToken(response, person.toJSON());
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

                const personFromDb = await PersonModel.findOne({
                    email: email,
                    password: security.encrypt(password)
                });

                // Vérifie que les données saisies sont correctes ou non
                if (!personFromDb)
                    return controller.failure(response, 'L\'email ou le mot de passe est incorrect !');

                return await security.registerToken(response, personFromDb.toJSON());
            }
        );
    }
);

router.post(
    endpoint.sign_in_with_google,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                // Récupère le token généré par Google
                const accessToken = request.query.access_token;

                if (!accessToken)
                    return controller.failure(response, 'Invalid token.');

                // Récupère les informations de l'utilisateur depuis un compte Google
                const oauth2Client = new OAuth2();
                oauth2Client.setCredentials({ access_token: accessToken });
                const oauth2 = googleApi.oauth2({ auth: oauth2Client, version: 'v2' });
                const googleResponse = await oauth2.userinfo.get();
                const personFromGoogle = googleResponse.data;

                // Vérifie que l'utilisateur n'existe pas dans notre base
                const personFromDb = await PersonModel.findOne({ email: personFromGoogle.email });
                if (personFromDb)
                    return await security.registerToken(response, personFromDb.toJSON());

                // Ajoute un utilisateur dans la base
                const person = await (
                    new PersonModel({
                        email: personFromGoogle.email,
                        username: personFromGoogle.name,
                        provider: 'google',
                        dronies: 0
                    })
                ).save();

                return await security.registerToken(response, person.toJSON());
            }
        );
    }
);

module.exports = router;
