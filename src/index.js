const express = require('express');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// let miniatures = [
//     { id: '1', name: 'AHRIMAN', move: '6', weaponSkill: '2+', ballisticSkill: '2+', strength: '4', toughness: '4', wounds: '6', attack: '5', leadership: '9', saveThrow: '3+', equipment: 'Ahriman is equipped with: inferno bolt pistol; Black Staff of Ahriman; frag grenades; krak grenades.'},
//     { id: '2', name: 'THOUSAND SONS DAEMON PRINCE', move: '8', weaponSkill: '2+', ballisticSkill: '2+', strength: '7', toughness: '6', wounds: '8', attack: '5', leadership: '10', saveThrow: '3+', equipment: 'A Thousand Sons Daemon Prince is equipped with: hellforged sword; ,alefic talons.'},
//     { id: '3', name: 'INFERNAL MASTER', move: '6', weaponSkill: '3+', ballisticSkill: '3+', strength: '4', toughness: '4', wounds: '4', attack: '4', leadership: '9', saveThrow: '3+', equipment: ''}
// ]

// построение схемы с использованием языка схем GraphQL
const typeDefs = require('./schema');

// предоставляем функцию разрешения для полей схемы
const resolvers = require('./resolvers');

// настройка Apollo Server
async function startApolloServer() {
  const app = express();
  db.connect(DB_HOST);
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: () => {
      // добавление моделей БД в context
      return { models };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/api' });

  app.get('/', (req, res) => res.send('Hello world'));

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  );
  return { server, app };
}

startApolloServer();
