const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/multimedia');
const MultimediaModel = require('./../models/multimedia');

const router = express.Router();

router.get(
    endpoint.fetch_by_id,
    security.validateToken,
    controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await MultimediaModel.findById(id);

                return (document)
                    ? controller.json(response, document)
                    : controller.createNotFound(response);
            }
        );
    }
);

router.get(
    endpoint.fetch_list_by_token,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.getUser(request);

                const listOfDocuments = await MultimediaModel.find({ person: appUser.id });

                return controller.json(response, listOfDocuments);
            }
        );
    }
);

router.post(
    endpoint.store_by_token,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.getUser(request);

                const document = new MultimediaModel({
                    ...(request.body),
                    person: appUser.id,
                    createdAt: new Date()
                });

                await document.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

router.patch(
    endpoint.update_by_id,
    security.validateToken,
    controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;
                const { path, source } = request.body;

                const document = await MultimediaModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                document.path = path;
                document.source = source;

                await document.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

router.delete(
    endpoint.delete_by_id,
    security.validateToken,
    controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await MultimediaModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                await MultimediaModel.deleteOne({ _id: id });

                return controller.json(response, { success: true });
            }
        );
    }
);

module.exports = router;
