const { gql } = require('apollo-server-express')

module.exports = gql`
type Miniature {
    id: ID
    name: String
    equipment: String
}

type Query {
    miniatures: [Miniature]
    miniature(id: ID): Miniature
}

type Mutation {
    newMiniature(equipment: String, name: String): Miniature!
    updateMiniature(id: ID!, equipment: String): Miniature!
    deleteMiniature(id: ID!): Boolean!
}
`