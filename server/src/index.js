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
      return {
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

// vraca promise sa konekcijom
connectDb().then(async () => {
  if (isTest || isProduction) {
    // reset database
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
      models.File.deleteMany({}),
    ]);

    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  console.log('seeding...');

  const avatar1 = new models.File({
    path: 'avatar.jpg',
    mimetype: 'image/jpg',
    filename: 'avatar.jpg',
  });

  const cover1 = new models.File({
    path: 'cover.jpg',
    mimetype: 'image/jpg',
    filename: 'cover.jpg',
  });

  const audio1 = new models.File({
    path: 'test.mp3',
    mimetype: 'audio/mpeg',
    filename: 'test.mp3',
  });

  const audio2 = new models.File({
    path: 'test.mp3',
    mimetype: 'audio/mpeg',
    filename: 'test.mp3',
  });

  const audio3 = new models.File({
    path: 'test.mp3',
    mimetype: 'audio/mpeg',
    filename: 'test.mp3',
  });

  const user1 = new models.User({
    username: 'rwieruch',
    email: 'hello@robin.com',
    password: 'rwieruch',
    role: 'ADMIN',
    name: 'Robin Wieruch',
    bio:
      'Real knowledge is to know amount of ones ignorance. - Confucius',
    avatarId: avatar1.id,
    coverId: cover1.id,
  });

  const user2 = new models.User({
    username: 'ddavids',
    email: 'hello@david.com',
    password: 'ddavids',
    name: 'Davids',
    bio:
      'Real knowledge is to know amount of ones ignorance. - Confucius',
    avatarId: avatar1.id,
    coverId: cover1.id,
  });

  const message1 = new models.Message({
    fileId: audio1.id,
    userId: user1.id,
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const message2 = new models.Message({
    fileId: audio2.id,
    userId: user2.id,
    createdAt: date.setSeconds(date.getSeconds() + 2),
  });

  const message3 = new models.Message({
    fileId: audio3.id,
    userId: user2.id,
    createdAt: date.setSeconds(date.getSeconds() + 3),
  });

  await avatar1.save();
  await cover1.save();

  await audio1.save();
  await audio2.save();
  await audio3.save();

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};
