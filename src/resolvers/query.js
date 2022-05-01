module.exports = {
        miniatures: async (parent, args, { models }) => {
            return await models.Miniature.find();
        },
        miniature: async (parent, args, { models }) => {
            return await models.Miniature.findById(args.id)
        }
}