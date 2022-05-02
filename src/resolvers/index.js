const Query = require('./query');
const Mutation = require('./mutation');
const Miniature = require('./miniature');
const User = require('./user');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
  Query,
  Mutation,
  Miniature,
  User,
  DateTime: GraphQLDateTime,
};
