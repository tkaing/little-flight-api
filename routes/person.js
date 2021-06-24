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
    endpoint.fetch_by_token,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

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

                if (personFromDb)
                    return controller.failure(response, 'Un utilisateur avec cet email existe déjà !');

                const person = await (
                    new PersonModel({
                        email: email,
                        username: username,
                        password: security.encrypt(password)
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

                const accessToken = request.query.access_token;

                if (!accessToken)
                    return controller.failure(response, 'Invalid token.');

                const oauth2Client = new OAuth2();
                oauth2Client.setCredentials({ access_token: accessToken });

                const oauth2 = googleApi.oauth2({ auth: oauth2Client, version: 'v2' });
                const googleResponse = await oauth2.userinfo.get();

                const personFromGoogle = googleResponse.data;
                const personFromDb = await PersonModel.findOne({ email: personFromGoogle.email });

                if (personFromDb)
                    return await security.registerToken(response, personFromDb.toJSON());

                const person = await (
                    new PersonModel({
                        email: personFromGoogle.email,
                        username: personFromGoogle.name,
                        provider: 'google'
                    })
                ).save();

                return await security.registerToken(response, person.toJSON());
            }
        );
    }
);

router.post(
    endpoint.add_friend,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { username } = request.body;

                const Token = await controller.getUser(request);
                const _Person = await PersonModel.findOne({ username: username });
                const _AppUser = await PersonModel.findOne({ _id: Token.id });

                if (!_Person)
                    return controller.failure(response, 'Amis introuvable.', 404);
                if (_AppUser._id.toString() === _Person._id.toString())
                    return controller.failure(response, 'Impossible de vous ajouter soi-même.', 403);
                if (_AppUser.friends.includes(_Person._id))
                    return controller.failure(response, 'Cette personne est déjà dans votre liste d\'amis.', 403);

                _AppUser.friends.push(_Person._id);

                await _AppUser.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

router.get(
    endpoint.list_of_friends,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const token = await controller.getUser(request);

                const appUser = await PersonModel.findOne({ _id: token.id });

                const listOfFriends = await PersonModel.find({ _id: { $in: appUser.friends } });

                return controller.json(response, listOfFriends);
            }
        );
    }
);

module.exports = router;
