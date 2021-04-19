const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/session');
const SessionModel = require('./../models/session');
const SessionStateEnum = require('./../utils/enums/session_state');

const router = express.Router();

router.get(
    endpoint.fetch_by_id,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await SessionModel.findById(id);

                return (document)
                    ? controller.json(response, document)
                    : controller.createNotFound(response);
            }
        );
    }
);

router.get(
    endpoint.fetch_list_by_token,
    security.validate_token,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.get_user(request);

                const listOfDocuments = await SessionModel.find({ person: appUser.id });

                return controller.json(response, listOfDocuments);
            }
        );
    }
);

router.post(
    endpoint.store_by_token,
    security.validate_token,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.get_user(request);

                const document = new SessionModel({
                    ...(request.body),
                    state: SessionStateEnum.CREATED,
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
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;
                const { state } = request.body;

                const document = await SessionModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                document.state = state;
                
                if (state === SessionStateEnum.FINISHED)
                    document.finishedAt = new Date();

                await document.save()
                    .then(data => controller.json(response, data))
                    .catch(failure => controller.failure(response, failure.errors));
            }
        );
    }
);

router.delete(
    endpoint.delete_by_id,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await SessionModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                await SessionModel.deleteOne({ _id: id });

                return controller.json(response, { success: true });
            }
        );
    }
);

module.exports = router;
