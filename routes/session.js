const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/session');
const PersonModel = require('./../models/person');
const SessionModel = require('./../models/session');

const router = express.Router();

router.get(
    endpoint.list,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {
                return controller.json(response, (await SessionModel.find().populate('person')))
            }
        );
    }
);

router.get(
    endpoint.list_by_token,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });

                return controller.json(response, (
                    await SessionModel.find({ person: appUser.id }).populate('person')
                ));
            }
        );
    }
);

router.post(
    endpoint.import,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { list } = request.body;

                // Vérifie que "list" est un tableau
                if (!Array.isArray(list))
                    return controller.failure(response, "WRONG FORMAT");

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id });

                // Ajoute chaque session depuis la liste
                for await (_it of list) {
                    await new SessionModel({
                        ..._it,
                        person: appUser.id,
                        createdAt: Date.now()
                    }).save();
                }

                return controller.json(response, (
                    await SessionModel.find({ person: appUser.id }).populate('person')
                ));
            }
        );
    }
);

module.exports = router;
