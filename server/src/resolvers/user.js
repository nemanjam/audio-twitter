import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin, isAuthenticated } from './authorization';
import { processFile } from '../utils/upload';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },
    user: async (parent, { username }, { models }) => {
      return await models.User.findOne({ username });
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '300m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '300m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { name, bio, avatar, cover },
        { models, me },
      ) => {
        const avatarSaved = await processFile(avatar);
        const coverSaved = await processFile(cover);
        return await models.User.findByIdAndUpdate(
          me.id,
          {
            $set: {
              name,
              bio,
              avatarId: avatarSaved.id,
              coverId: coverSaved.id,
            },
          },
          { new: true },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin, // samo admin moze da brise
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.find({
        userId: user.id,
      });
    },
    avatar: async (user, args, { models }) => {
      return await models.File.findOne({
        avatarId: user.avatarId,
      });
    },
    cover: async (user, args, { models }) => {
      return await models.File.findOne({
        coverId: user.coverId,
      });
    },
  },
};
