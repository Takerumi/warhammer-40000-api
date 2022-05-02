const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
require('dotenv').config();
const mongoose = require('mongoose')

module.exports = {
  newMiniature: async (parent, args, { models, user }) => {
    // проверяем передан ли в контексте пользователь, если нет - выбрасываем AuthenticationError
    if (!user) {
      throw new AuthenticationError('You must be signed to create a miniature characteristics')
    }
    return await models.Miniature.create({
      equipment: args.equipment,
      name: args.name,
      // ссылка на id автора
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  deleteMiniature: async (parent, { id }, { models }) => {
    try {
      await models.Miniature.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateMiniature: async (parent, { equipment, id }, { models }) => {
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
        throw new AuthenticationError('Error signing in')
    }
    // если пароли не совпадают, выбрасываем ошибку аутентификации
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        throw new AuthenticationError('Error signing in')
    }
    // возвращаем json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  }
};
