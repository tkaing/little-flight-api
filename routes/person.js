const express = require("express");
const googleApi = require('googleapis').google;

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const util = require('../utils/person');
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

// === Points ===

// === Friend ===

router.post(
    endpoint.add_friend,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { username } = request.body;

                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });
                const personAsFriend = await PersonModel.findOne({ username: username });

                if (!personAsFriend)
                    return controller.failure(response, 'NOT FOUND', 404);

                if (appUser._id.toString() === personAsFriend._id.toString())
                    return controller.failure(response, 'MYSELF', 403);

                if (!Array.isArray(appUser.friends))
                    appUser.friends = [];

                const friend = appUser.friends
                    .find(_it => _it.person.toString() === personAsFriend._id.toString());

                if (friend) {
                    if (friend.isAccepted)
                        return controller.failure(response, 'ACCEPTED', 403);
                    else
                        return controller.failure(response, 'PENDING', 403);
                }

                appUser.friends.push({ person: personAsFriend._id });

                await appUser.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

router.patch(
    endpoint.accept_friend,
    security.validateToken, controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const token = await controller.getUser(request);

                const appUser = await PersonModel.findOne({ _id: token.id });

                if (!Array.isArray(appUser.friends))
                    appUser.friends = [];

                const _index = appUser.friends.findIndex(_it => _it._id.toString() === id.toString());

                if (_index > -1)
                    appUser.friends[_index].isAccepted = true;

                await appUser.save();
                    /*.then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));*/

                const listOfFriends = await util.list_of_friends(appUser);

                return controller.json(response, listOfFriends);
            }
        )
    }
);

router.delete(
    endpoint.reject_friend,
    security.validateToken, controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const token = await controller.getUser(request);

                const appUser = await PersonModel.findOne({ _id: token.id });

                if (!Array.isArray(appUser.friends))
                    appUser.friends = [];

                const _index = appUser.friends.findIndex(_it => _it._id.toString() === id.toString());

                if (_index > -1)
                    appUser.friends.splice(_index, 1);

                await appUser.save();
                    /*.then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));*/

                const listOfFriends = await util.list_of_friends(appUser);

                return controller.json(response, listOfFriends);
            }
        )
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

                const listOfFriends = await util.list_of_friends(appUser);

                return controller.json(response, listOfFriends);
            }
        );
    }
);

module.exports = router;
