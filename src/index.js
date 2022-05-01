const express = require('express');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const db = require('./db');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// построение схемы с использованием языка схем GraphQL
const typeDefs = require('./schema');

// предоставляем функцию разрешения для полей схемы
const resolvers = require('./resolvers');

const getUser = (token) => {
  if (token) {
    try {
      // возвращаем инфо пользователя из токена
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

// настройка Apollo Server
async function startApolloServer() {
  const app = express();
  db.connect(DB_HOST);
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      // получаем токен пользователя из заголовков
      const token = req.headers.authorization;
      // извлекаем пользователя с помощью токена
      const user = getUser(token);
      console.log(user);
      // добавление моделей БД в context
      return { models, user };
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
