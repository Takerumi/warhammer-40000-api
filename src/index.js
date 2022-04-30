const express = require('express')
const http = require("http")
const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
require('dotenv').config()

const db = require('./db')

const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

let notes = [
    { id: '1', content: 'This is a note', author: 'Ann Dawn' },
    { id: '2', content: 'This is another note', author: 'Harley Brew' },
    { id: '3', content: 'Oh look, another note again', author: 'Bradley Cooper' }
]

// построение схемы с использованием языка схем GraphQL
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Mutation {
        newNote(content: String!): Note!
    }
`

// предоставляем функцию разрешения для полей схемы
const resolvers = {
    Query: {
        hello: () => 'Hello World!!!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id)
        }
    },
    Mutation: {
     newNote: (parent, args) => {
         let noteValue = {
             id: String(notes.length + 1),
             content: args.content,
             author: 'Borman Karlovich'
         }
         notes.push(noteValue)
         return noteValue
     }   
    }
}

// настройка Apollo Server
async function startApolloServer() {
    const app = express()
    db.connect(DB_HOST)
    const httpServer = http.createServer(app)
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

await server.start();

server.applyMiddleware({ app, path: '/api'})

app.get('/', (req, res) => res.send('Hello world'))

await new Promise(resolve => httpServer.listen({ port }, resolve))
console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
return { server, app}
}

startApolloServer()