const express = require('express')
const http = require("http")
const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const port = process.env.PORT || 4000


// построение схемы с использованием языка схем GraphQL
const typeDefs = gql`
    type Query {
        hello: String
    }
`

// предоставляем функцию разрешения для полей схемы
const resolvers = {
    Query: {
        hello: () => 'Hello WORLD'
    }
}

// настройка Apollo Server
async function startApolloServer() {
    const app = express()
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