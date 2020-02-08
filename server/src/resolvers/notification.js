import mongoose, { models } from 'mongoose';
import { combineResolvers } from 'graphql-resolvers';
import { withFilter } from 'apollo-server';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated } from './authorization';
const ObjectId = mongoose.Types.ObjectId;

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    notifications: combineResolvers(
      isAuthenticated,
      async (parent, { cursor, limit = 100 }, { models, me }) => {
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
              ownerId: ObjectId(me.id),
            }
          : { ownerId: ObjectId(me.id) };

        const notifications = await models.Notification.find(
          cursorOptions,
          null,
          {
            sort: { createdAt: -1 },
            limit: limit + 1,
          },
        );

        // console.log(notifications);

        const hasNextPage = notifications.length > limit;
        const edges = hasNextPage
          ? notifications.slice(0, -1)
          : notifications; //-1 exclude zadnji

        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: edges[edges.length - 1]
              ? toCursorHash(
                  edges[edges.length - 1].createdAt.toString(),
                )
              : '',
          },
        };
      },
    ),
  },

  Mutation: {},

  Notification: {
    user: async (notification, args, { models, me }) => {
      return await models.User.findById(notification.userId);
    },
  },

  Subscription: {
    notificationCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.NOTIFICATION.CREATED),
        //me usera koji radi subskripciju, me usera koji radi like mutaciju je u messages resolveru
        async (payload, args, { me }) => {
          //razliciti _id za ownerId i me.id, oba user0 wtf?
          const ownerId =
            payload?.notificationCreated?.notification?.ownerId;
          const owner = await models.User.findById(ownerId);
          //console.log(payload, me, owner);
          //if message owner === loggedin user
          const condition = owner.username === me.username;
          //console.log(condition);
          return condition;
        },
      ),
    },
  },
};
