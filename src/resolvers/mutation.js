const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
require('dotenv').config();
const mongoose = require('mongoose');

module.exports = {
  newMiniature: async (parent, args, { models, user }) => {
    // проверяем передан ли в контексте пользователь, если нет - выбрасываем AuthenticationError
    if (!user) {
      throw new AuthenticationError(
        'You must be signed to create a miniature characteristics'
      );
    }
    return await models.Miniature.create({
      equipment: args.equipment,
      name: args.name,
      // ссылка на id автора
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteMiniature: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError(
        'You must be signed in to delete a miniature note'
      );
    }
    // TODO: ввести проверку на административные права
    try {
      await models.Miniature.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateMiniature: async (parent, { equipment, id }, { models, user }) => {
    if (!iser) {
      throw new AuthenticationError(
        'You must be signed in to update a miniature note'
      );
    }
    // TODO: ввести проверку на административные права
    try {
      return await models.Miniature.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            equipment,
          },
        },
        {
          new: true,
        }
      );
    } catch (err) {
      throw new Error('Error updating');
    }
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError();
    }
    // проверка есть ли запись уже в избранном
    let noteCheck = await models.Miniature.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    // если пользователь уже в списке, удаляем его и уменьшаем на 1 favouriteCount
    if (hasUser >= 0) {
      return await models.Miniature.findOneAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          // устанавливаем значение true, чтобы вернуть обновленный документ
          new: true,
        }
      );
    } else {
      // если пользователь не в списке, добавляем и увеличиваем на 1 favoriteCount
      return await models.Miniature.findOneAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    // нормализуем email
    email = email.trim().toLowerCase();
    // хешируем пароль
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        username,
        email,
        password: hashed,
      });
      // создаем и возвращаем json web token
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    // если пользователь не найден, выбрасываем ошибку аутентификации
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }
    // если пароли не совпадают, выбрасываем ошибку аутентификации
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }
    // возвращаем json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};
