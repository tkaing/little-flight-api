const PersonModel = require('./../models/person');
const cryptoRandomString = require("crypto-random-string");

module.exports = {
    list_of_friends: async (appUser) => {

        const listOfFriends = [];

        if (!Array.isArray(appUser.friends))
            appUser.friends = [];

        for await (_it of appUser.friends) {
            _it.person = await PersonModel.findOne({ _id: _it.person });
            if (_it.person)
                listOfFriends.push(_it);
        }

        return listOfFriends;
    },
    generate_unique: async (collection) => {
        const uniqueId = cryptoRandomString({ length: 10, type: 'url-safe' });
        const party = await collection.findOne({ uniqueId: uniqueId });
        return party ? this.generate_unique(collection) : uniqueId;
    }
};
