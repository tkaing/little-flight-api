const express = require("express");

const manager = require('./../api/api_manager');
const security = require('./../api/api_security');
const validation = require('./../api/api_validation');

const endpoints = require('./../endpoints/multimedias');
const MultimediaModel = require('./../models/multimedia');

const router = express.Router();

router.get(
    endpoints.fetch_by_id,
    manager.param_id,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const { id } = request.params;

                const document = await MultimediaModel.findById(id);

                return (document)
                    ? response.json(document)
                    : response.status(404).json(validation.NotFound);
            }
        );
    }
);

router.get(
    endpoints.fetch_list_by_token,
    security.validate_token,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const appUser = await manager.getUser(request);

                const listOfDocuments = await MultimediaModel.find({ person: appUser.id });

                return response.json(listOfDocuments);
            }
        );
    }
);

router.post(
    endpoints.store_by_token,
    security.validate_token,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const appUser = await manager.getUser(request);

                const { path, source } = request.body;

                const multimedia = new MultimediaModel({
                    path: path,
                    source: source,
                    createdAt: new Date(),
                    person: appUser.id
                });

                await multimedia.save()
                    .then(result => response.json(result))
                    .catch(failure => response.status(400).json(failure.errors));
            }
        );
    }
);

router.patch(
    endpoints.update_by_id,
    manager.param_id,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const { id } = request.params;
                const { path, source } = request.body;

                const document = await MultimediaModel.findById(id);

                if (!document)
                    return response.status(404).json(validation.NotFound);

                document.path = path;
                document.source = source;

                await document.save()
                    .then(result => response.json(result))
                    .catch(failure => response.status(400).json(failure.errors));
            }
        );
    }
);

router.delete(
    endpoints.delete_by_id,
    manager.param_id,
    async (request, response) => {
        return manager.exec(
            request, response, async () => {

                const { id } = request.params;

                const document = await MultimediaModel.findById(id);

                await MultimediaModel.deleteOne({ _id: id });

                await document.save()
                    .then(result => response.json(result))
                    .catch(failure => response.status(400).json(failure.errors));
            }
        );
    }
);

module.exports = router;
