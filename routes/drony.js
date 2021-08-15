const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/drony');
const DronyModel = require('./../models/drony');
const PersonModel = require('./../models/person');

const router = express.Router();

router.post(
    endpoint.send_to_friend, controller.objectId(),
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;
                const { amount } = request.body;

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id }); //token user (user connected)
                const adressee = await PersonModel.findOne({ _id: id }); //adressee

                // Met à jour les informations de l'utilisateur connecté et du destinataire des dronies
                if (!appUser.dronies)
                    appUser.dronies = 0;

                if (!adressee.dronies)
                        adressee.dronies = 0;

                appUser.dronies += 25;
                adressee.dronies += amount;

                await appUser.save();
                await adressee.save();

                // Ajoute un drony dans le cas d'un envoi
                const drony = await (
                    new DronyModel({
                        sender: appUser._id,
                        amount: amount,
                        adressee: adressee._id,
                        createdAt: Date.now(),
                        subject: "SEND"
                    })
                ).save();

                return controller.json(response, await DronyModel.findOne({ _id: drony._id })
                    .populate('sender')
                    .populate('adressee'));
            }
        );
    }
);


router.post(
    endpoint.buy,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { amount } = request.body

                // Récupère l'utilisateur enregistré par le token
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id }); //token user (user connected)
                const adressee = await PersonModel.findOne({ _id: controller.toObjectId("60e5f10835885f00159f1a56") }); //adressee

                // Met à jour les informations de l'utilisateur connecté et du destinataire des dronies
                if (!appUser.dronies)
                    appUser.dronies = 0;

                if (!adressee.dronies)
                        adressee.dronies = 0;

                appUser.dronies -= amount;
                adressee.dronies += amount;

                await appUser.save();
                await adressee.save();

                // Ajoute un drony dans le cas d'un achat
                const drony = await (
                    new DronyModel({
                        sender: appUser._id,
                        amount: amount,
                        adressee: adressee._id,
                        createdAt: Date.now(),
                        subject: "BUY"
                    })
                ).save();

                return controller.json(response, await DronyModel.findOne({ _id: drony._id })
                    .populate('sender')
                    .populate('adressee'));
            }
        );
    }
);

router.get(
    '/live',
    async (request, response) => {

            return controller.json(response, "");
    }
)


module.exports = router;
