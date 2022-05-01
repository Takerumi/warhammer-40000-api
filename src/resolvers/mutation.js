module.exports = {
    newMiniature: async (parent, args, { models }) => {
        return await models.Miniature.create({
            equipment: args.equipment,
            name: args.name
        })
    },
    deleteMiniature: async (parent, { id }, { models }) => {
        try {
            await models.Miniature.findOneAndRemove({ _id: id })
            return true
        } catch (err) {
            return false
        }
    },
    updateMiniature: async (parent, { equipment, id }, { models }) => {
        return await models.Miniature.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    equipment
                }
            },
            {
                new: true
            }
        )
    }
}