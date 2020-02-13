import mongoose, { models } from 'mongoose';
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import pubsub, { EVENTS } from '../subscription';
import { isAdmin, isAuthenticated } from './authorization';
import { processFile } from '../utils/upload';
const ObjectId = mongoose.Types.ObjectId;

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

const publishUserNotification = async (owner, user, action) => {
  const notification = await models.Notification.create({
    ownerId: owner.id,
    messageId: null,
    userId: user.id,
    action,
  });

  pubsub.publish(EVENTS.NOTIFICATION.CREATED, {
    notificationCreated: { notification },
  });

  const unseenNotificationsCount = await models.Notification.find({
    ownerId: notification.ownerId,
    isSeen: false,
  }).countDocuments();

  pubsub.publish(EVENTS.NOTIFICATION.NOT_SEEN_UPDATED, {
    notSeenUpdated: unseenNotificationsCount,
  });
};

export default {
  Query: {
    // who to follow filter koje vec ne pratis
    whoToFollow: async (parent, { limit = 10 }, { models, me }) => {
      const filter = me
        ? {
            _id: {
              $ne: ObjectId(me.id),
            },
            // followersIds: { $ne: mongoose.Types.ObjectId(me.id) },
          }
        : {};
      return await models.User.find(filter, null, {
        limit,
      });
    },
    friends: async (
      parent,
      { username, isFollowing, isFollowers, limit = 10 },
      { models, me },
    ) => {
      const user = await models.User.findOne({ username });

      const filter = {
        // ...(me && {
        //   _id: { $ne: ObjectId(me.id) },
        // }),
        ...(user &&
          isFollowing && {
            followersIds: { $in: [user.id] },
          }),
        ...(user &&
          isFollowers && {
            followingIds: { $in: [user.id] },
          }),
      };

      return await models.User.find(filter, null, {
        limit,
      });
    },
    user: async (parent, { username }, { models }) => {
      return await models.User.findOne({ username });
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      const user = await models.User.findById(me.id);
      const unseenNotificationsCount = await models.Notification.find(
        {
          ownerId: user.id,
          isSeen: false,
        },
      ).countDocuments();

      pubsub.publish(EVENTS.NOTIFICATION.NOT_SEEN_UPDATED, {
        notSeenUpdated: unseenNotificationsCount,
      });
      return user;
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
        const avatarSaved = avatar
          ? await processFile(avatar)
          : undefined;
        const coverSaved = cover
          ? await processFile(cover)
          : undefined;

        const user = {
          name,
          bio,
          avatarId: avatarSaved && avatarSaved.id,
          coverId: coverSaved && coverSaved.id,
        };

        for (let prop in user) if (!user[prop]) delete user[prop];

        return await models.User.findByIdAndUpdate(
          me.id,
          {
            $set: user,
          },
          { new: true, useFindAndModify: false },
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

    followUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        const followedUser = await models.User.findOneAndUpdate(
          { username },
          { $push: { followersIds: me.id } },
        );

        if (!followedUser) return false;
        const followingUser = await models.User.findOneAndUpdate(
          { _id: me.id },
          { $push: { followingIds: followedUser.id } },
        );
        await publishUserNotification(followedUser, me, 'follow');

        return !!followingUser;
      },
    ),

    unfollowUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        const unfollowedUser = await models.User.findOneAndUpdate(
          { username },
          { $pull: { followersIds: me.id } },
        );

        if (!unfollowedUser) return false;

        const followingUser = await models.User.findOneAndUpdate(
          { _id: me.id },
          { $pull: { followingIds: unfollowedUser.id } },
        );
        await publishUserNotification(unfollowedUser, me, 'unfollow');

        return !!followingUser;
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
      return await models.File.findById(user.avatarId);
    },
    cover: async (user, args, { models }) => {
      return await models.File.findById(user.coverId);
    },
    followers: async (user, args, { models }) => {
      return await models.User.find({
        followingIds: { $in: [user.id] },
      });
    },
    following: async (user, args, { models }) => {
      return await models.User.find({
        followersIds: { $in: [user.id] },
      });
    },
    followersCount: async (user, args, { models }) => {
      const followers = await models.User.find({
        followingIds: { $in: [user.id] },
      });
      return followers.length;
    },
    followingCount: async (user, args, { models }) => {
      const following = await models.User.find({
        followersIds: { $in: [user.id] },
      });
      return following.length;
    },
    messagesCount: async (user, args, { models }) => {
      const messages = await models.Message.find({
        userId: user.id,
      });
      return messages.length;
    },
    isFollowHim: async (user, args, { models, me }) => {
      if (!me) return false;

      const followers = await models.User.find({
        followingIds: { $in: [user.id] },
      });
      const amIFollowing = !!followers.find(
        user => user.username === me?.username,
      );
      return amIFollowing;
    },
    isFollowsMe: async (user, args, { models, me }) => {
      if (!me) return false;

      const following = await models.User.find({
        followersIds: { $in: [user.id] },
      });
      const amIFollowed = !!following.find(
        user => user.username === me?.username,
      );
      return amIFollowed;
    },
  },
};
