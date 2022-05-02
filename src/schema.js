const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Miniature {
    id: ID!
    name: String!
    equipment: String
    updatedAt: DateTime!
    favoriteCount: Int
    favoritedBy: [User]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favorites: [Miniature]
  }

  type Query {
    miniatures: [Miniature]
    miniature(id: ID): Miniature
  }

  type Mutation {
    newMiniature(equipment: String, name: String): Miniature!
    updateMiniature(id: ID!, equipment: String): Miniature!
    deleteMiniature(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String!, password: String!): String!
    toggleFavorite(id: ID!): Miniature!
  }
`;
