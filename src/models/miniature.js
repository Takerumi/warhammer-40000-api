const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const miniatureSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    equipment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // присваеваем полю updatedAt тип Date
    timestamps: true,
  }
);

const Miniature = mongoose.model('Miniature', miniatureSchema);

module.exports = Miniature;
