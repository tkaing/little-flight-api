const express = require("express");

const mongo = require('./../api/api_mongo');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/session_metadata');
const SessionMetadataModel = require('./../models/session_metadata');

const router = express.Router();

router.get(
    endpoint.fetch_by_id,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await SessionMetadataModel.findById(id);

                return (document)
                    ? controller.json(response, document)
                    : controller.createNotFound(response);
            }
        );
    }
);

router.get(
    endpoint.fetch_list_by_session,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {
                
                const { id } = request.params;
                
                const listOfDocuments = await SessionMetadataModel.find({ session: id });

                return controller.json(response, listOfDocuments);
            }
        );
    }
);

router.post(
    endpoint.store_by_session,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = new SessionMetadataModel({
                    ...(request.body),
                    session: id,
                    createdAt: new Date()
                });

                await document.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

module.exports = router;
