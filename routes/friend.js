const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const util = require('../utils/friend');
const endpoint = require('../endpoints/friend');
const PersonModel = require('./../models/person');
const FriendModel = require('./../models/friend');

const router = express.Router();

router.post(
    endpoint.add,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { username } = request.body;

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });
                const fetchPerson = await PersonModel.findOne({ username: username });

                // Vérifie que l'utilisateur existe ou non
                if (!fetchPerson)
                    return controller.failure(response, 'NOT FOUND', 404);

                // Vérifie que l'utilisateur connecté ne s'ajoute pas lui-même
                if (appUser._id.toString() === fetchPerson._id.toString())
                    return controller.failure(response, 'MYSELF', 403);

                // Récupère une demande d'ami
                const fetchFriend = await FriendModel.findOne({
                    requestBy: { $in: [appUser._id, fetchPerson._id] },
                    requestTo: { $in: [appUser._id, fetchPerson._id] },
                });

                // Vérifie le statut de la demande d'ami
                if (fetchFriend) {
                    if (fetchFriend.isAccepted)
                        return controller.failure(response, 'ACCEPTED', 403);
                    else
                        return controller.failure(response, 'PENDING', 403);
                }

                // Ajoute une demande d'ami
                await (
                    new FriendModel({
                        requestBy: appUser._id,
                        requestTo: fetchPerson._id
                    })
                ).save();

                return controller.json(response, await util.list_of_friends(appUser));
            }
        );
    }
);

router.get(
    endpoint.list,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });
                return controller.json(response, await util.list_of_friends(appUser));
            }
        );
    }
);

router.patch(
    endpoint.accept, controller.objectId(),
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });
                const fetchFriend = await FriendModel.findOne({ _id: id });

                // Vérifie que la demande d'ami existe ou non
                if (!fetchFriend)
                    return controller.failure(response, 'NOT FOUND', 404);

                fetchFriend.isAccepted = true;

                await fetchFriend.save();

                return controller.json(response, await util.list_of_friends(appUser));
            }
        );
    }
);

router.delete(
    endpoint.reject, controller.objectId(),
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });
                const fetchFriend = await FriendModel.findOne({ _id: id });

                // Vérifie que la demande d'ami existe ou non
                if (!fetchFriend)
                    return controller.failure(response, 'NOT FOUND', 404);

                // Supprime la demande d'ami
                await FriendModel.deleteOne({ _id: fetchFriend._id });

                return controller.json(response, await util.list_of_friends(appUser));
            }
        );
    }
);

module.exports = router;
