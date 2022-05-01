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
    }
);

const Miniature = mongoose.model('Miniature', miniatureSchema)

module.exports = Miniature