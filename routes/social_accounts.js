const express = require("express");

const mongo = require('./../api/api_mongo');
const controller = require('./../api/api_controller');

const endpoint = require('../endpoints/social_account');
const SocialAccountModel = require('./../models/social_account');

const router = express.Router();

router.get(
    endpoint.fetch_by_id,
    controller.object_id(),
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                const { id } = request.params;

                const document = await SocialAccountModel.findById(id);

                return (document)
                    ? controller.json(response, document)
                    : controller.createNotFound(response);
            }
        );
    }
);

router.post(
    endpoint.store,
    async (request, response) => {
        return mongo.execute(
            request, response, async () => {

                let document = await SocialAccountModel.findOne(request.body);

                if (document)
                    return controller.failure(response, 'Un social account identique existe déjà !');

                const socialAccount = new SocialAccountModel({ ...(request.body) });

                await socialAccount.save()
                    .then(data => document = data)
                    .catch(failure => controller.failure(response, failure.errors));

                return controller.json(response, document);
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

                const document = await SocialAccountModel.findById(id);

                if (!document)
                    return controller.createNotFound(response);

                await SocialAccountModel.deleteOne({ _id: id });

                return controller.json(response, { success: true });
            }
        );
    }
);

module.exports = router;
