const FriendModel = require('./../models/friend');

module.exports = {
    // Structure les demandes d'amis et les amis d'un utilisateur
    list_of_friends: async (appUser) => {
        return {
            requestByMe: {
                pending: await FriendModel
                    .find({ requestBy: appUser._id, isAccepted: false })
                    .populate('requestBy')
                    .populate('requestTo'),
                accepted: await FriendModel
                    .find({ requestBy: appUser._id, isAccepted: true })
                    .populate('requestBy')
                    .populate('requestTo'),
            },
            requestByOthers: {
                pending: await FriendModel
                    .find({ requestTo: appUser._id, isAccepted: false })
                    .populate('requestBy')
                    .populate('requestTo'),
                accepted: await FriendModel
                    .find({ requestTo: appUser._id, isAccepted: true })
                    .populate('requestBy')
                    .populate('requestTo'),
            },
        };
    }
}
