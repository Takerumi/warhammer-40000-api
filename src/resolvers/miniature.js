module.exports = {
  author: async (miniature, args, { models }) => {
    return await models.User.findById(miniature.author);
  },
  favoritedBy: async (miniature, args, { models }) => {
    return await models.User.find({ _id: { $in: miniature.favoritedBy } });
  },
};
