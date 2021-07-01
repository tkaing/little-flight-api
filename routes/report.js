const express = require("express");

const mongo = require('./../api/api_mongo');
const security = require('./../api/api_security');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/report');
const ReportModel = require('./../models/report');

const router = express.Router();

router.get(
    endpoint.list,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {
                return controller.json(response, (await ReportModel.find().populate('person')))
            }
        );
    }
);

router.post(
    endpoint.open,
    security.validateToken,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const appUser = await controller.getUser(request);

                const document = new ReportModel({
                    ...(request.body),
                    person: appUser.id
                });

                await document.save();

                return controller.json(response, document);
            }
        );
    }
);

router.patch(
    endpoint.close,
    security.validateToken, controller.objectId(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                let document = await ReportModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                document.isClosed = true;

                await document.save();

                return controller.json(response, document);
            }
        );
    }
);

module.exports = router;
