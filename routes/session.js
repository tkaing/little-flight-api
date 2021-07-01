const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/session');
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

router.post(
    endpoint.create,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.getUser(request);

                const document = new SessionModel({
                    ...(request.body),
                    person: appUser.id,
                });

                await document.save();

                return controller.json(response, document);
            }
        );
    }
);

router.patch(
    endpoint.update,
    security.validateToken, controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                let document = await SessionModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                document = {
                    ...document,
                    ...(request.body)
                };

                await document.save();

                return controller.json(response, document);
            }
        );
    }
);

module.exports = router;
