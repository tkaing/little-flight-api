const cryptoRandomString = require("crypto-random-string");
const PersonModel = require('./../models/person');


module.exports = {
    generate_unique: async (collection) => {
        const uniqueId = cryptoRandomString({ length: 10, type: 'url-safe' });
        const party = await collection.findOne({ uniqueId: uniqueId });
        return party ? this.generate_unique(collection) : uniqueId;
    },
};
