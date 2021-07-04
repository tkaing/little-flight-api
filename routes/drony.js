const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const util = require('../utils/drony');
const endpoint = require('../endpoints/drony');
const PersonModel = require('./../models/person');
const DronyModel = require('./../models/drony');

const router = express.Router();

router.post(
    endpoint.send_to_friend, controller.objectId(),
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;
                const { amount } = request.body
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id }); //token user (user connected) 
                const adressee = await PersonModel.findOne({ _id: id }); //adressee
                
                if (!appUser.dronies) 
                    appUser.dronies = 0; 
                appUser.dronies += 25; 
                adressee.dronies += amount;
                await appUser.save();
                await adressee.save();
                const drony = await (
                    new DronyModel({
                        sender: appUser._id,
                        amount: amount,
                        adressee: adressee._id,
                        createdAt: Date.now(),
                        subject: "SEND"
                    })
                ).save();
                //console.log("=== DRONY ===", drony);

                return controller.json(response, await DronyModel.find({ _id: drony._id })
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
                const token = await controller.getUser(request);
                const appUser = await PersonModel.findOne({ _id: token.id }); //token user (user connected) 
                const adressee = await PersonModel.findOne({ _id: controller.toObjectId("60df3fb89ad092f1451837b9") }); //adressee
                if (!appUser.dronies) 
                    appUser.dronies = 0; 
                appUser.dronies -= amount; 
                adressee.dronies += amount; //250
                await appUser.save();
                await adressee.save();
                //logic

                const drony = await (
                    new DronyModel({
                        sender: appUser._id,
                        amount: amount,
                        adressee: adressee._id,
                        createdAt: Date.now(),
                        subject: "BUY"
                    })
                ).save();

                return controller.json(response, await DronyModel.find({ _id: drony._id })
                    .populate('sender')
                    .populate('adressee'));
            }
        );
    }
);


module.exports = router;
