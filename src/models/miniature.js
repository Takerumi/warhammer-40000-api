const mongoose = require('mongoose')

const Schema = mongoose.Schema

const miniatureSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        equipment: {
            type: String,
            required: true
        }
    },
    {
        // присваеваем полю updatedAt тип Date
        timestamps: true
    }
);

const Miniature = mongoose.model('Miniature', miniatureSchema)

module.exports = Miniature