import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import loaders from './loaders';
import { createUsersWithMessages } from './utils/seed';
import { deleteFile } from './utils/upload';

const app = express();

app.use(cors());
app.use(morgan('dev'));

existsSync(path.join(__dirname, '../uploads')) ||
  mkdirSync(path.join(__dirname, '../uploads'));
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads')),
);

// vadi usera iz tokena, a ne iz baze
// i mece ga u context
const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      const token = connectionParams.authToken;
      const me = await jwt.verify(token, process.env.SECRET);
      return { me };
    },
  },
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '') // string replace
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    // subskribcije
    if (connection) {
      const me = connection.context.me;
      console.log('ws me ', me?.username, me?.id);
      return {
        me,
        models,
        loaders: {
          // batching, samo unique keys usera, nema ponavljanja
          // batching: puno malih sql upita u jedan veci i brzi mnogo
          // DataLoader facebookova biblioteka
          // cache u okviru jednog zahteva, ako van server scope onda vise kesira...
          // ide u context
          // gledas koliko upita baza izvrsava negde u mongo konzoli
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
          file: new DataLoader(keys =>
            loaders.file.batchFiles(keys, models),
          ),
        },
      };
    }

    // http, mutacije i queries
    if (req) {
      const me = await getMe(req);
      console.log('http me ', me?.username, me?.id);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
          file: new DataLoader(keys =>
            loaders.file.batchFiles(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer); // subscribtions

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;

// vraca promise sa konekcijom koju ne koristi
connectDb().then(async connection => {
  if (isTest || isProduction) {
    const files = await models.File.find({
      path: { $nin: ['test.mp3', 'avatar.jpg', 'cover.jpg'] },
    });
    // console.log(files);
    files.map(file => {
      deleteFile(file.path);
    });

    // reset database
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
      models.File.deleteMany({}),
      models.Notification.deleteMany({}),
    ]);

    await createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
