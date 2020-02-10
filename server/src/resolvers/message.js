import mongoose, { models } from 'mongoose';
import { combineResolvers } from 'graphql-resolvers';
import { withFilter } from 'apollo-server';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';
import { processFile } from '../utils/upload';
const ObjectId = mongoose.Types.ObjectId;

// to base64, da klijent aplikacija ne bi radila sa datumom nego sa stringom
const toCursorHash = string => Buffer.from(string).toString('base64');

// from base64
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    // kursor je vazan za vrednost podatka, a ne index elementa kao u offset/limmit paginaciji
    // kad se izbrise iz izvadjenih offset postaje nevalidan, a kursor ostaje uvek isti
    // createdAt za cursor
    messages: async (
      parent,
      { cursor, limit = 100, username },
      { models, me },
    ) => {
      //user cija je profile stranica
      const user = username
        ? await models.User.findOne({
            username,
          })
        : null;

      //me je user sa clienta, iz tokena, logovani user
      const meUser = me ? await models.User.findById(me.id) : null;
      //console.log(meUser);

      const cursorTime = cursor
        ? new Date(fromCursorHash(cursor)) //.toISOString()
        : null;

      //console.log(cursor, cursorTime);

      const match = {
        // za prvi upit ne treba cursor
        ...(cursorTime && {
          createdAt: {
            $lt: cursorTime, //MORA NEW DATE(), sa toISOString ne radi
          },
        }),
        // user page
        ...(username && {
          $or: [
            //njegovi
            {
              userId: ObjectId(user.id),
            },
            //ili tudji koje je on rt
            {
              'repost.reposterId': ObjectId(user.id),
            },
          ],
        }),
        // timeline, see messages only from following and me
        ...(meUser &&
          !username && {
            $or: [
              {
                userId: {
                  $in: [
                    ...meUser.followingIds.map(id => ObjectId(id)),
                    ObjectId(me.id),
                  ],
                },
              },
              //rt-ovi onih koje pratim i moji
              {
                'reposts.reposterId': {
                  $in: [
                    ...meUser.followingIds.map(id => ObjectId(id)),
                    ObjectId(me.id),
                  ],
                },
              },
            ],
          }),
        //timeline for non loged user, all tweets
        ...(!meUser && !username && {}),
      };

      // console.log(JSON.stringify(match, null, 2));

      const messages = await models.Message.aggregate([
        {
          $addFields: {
            id: { $toString: '$_id' },
          },
        },
        { $match: match },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: limit + 1,
        },
      ]);

      // console.log(messages);

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages; //-1 exclude zadnji

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
  },

  Mutation: {
    // combine middlewares
    createMessage: combineResolvers(
      // resolver middleware
      isAuthenticated,
      // obican resolver
      async (parent, { file }, { models, me }) => {
        const fileSaved = await processFile(file);

        // mora create a ne constructor za timestamps
        const message = await models.Message.create({
          fileId: fileSaved.id,
          userId: me.id,
        });
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message },
        });

        return message;
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        const message = await models.Message.findById(id);

        if (message) {
          await message.remove();
          return true;
        } else {
          return false;
        }
      },
    ),

    likeMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const likedMessage = await models.Message.findOneAndUpdate(
          { _id: messageId },
          { $push: { likesIds: me.id } },
        );

        //2 iste notifikacije ?
        /*const notification = await models.Notification.create({
          ownerId: likedMessage.userId,
          userId: me.id,
          action: 'like',
        });*/

        //GDE JE MESSAGE ID? USER MOZE SAMO JEDNU INTERAKCIJU SA DRUGIM USEROM
        const notification = await models.Notification.findOneAndUpdate(
          {
            //query
            ownerId: likedMessage.userId,
            messageId: likedMessage._id,
            userId: me.id,
            action: 'like',
          },
          {
            //update
            ownerId: likedMessage.userId,
            messageId: likedMessage._id,
            userId: me.id,
            action: 'like',
          },
          {
            //options
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );

        pubsub.publish(EVENTS.NOTIFICATION.CREATED, {
          notificationCreated: { notification },
        });

        return !!likedMessage;
      },
    ),
    unlikeMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const unlikedMessage = await models.Message.findOneAndUpdate(
          { _id: messageId },
          { $pull: { likesIds: me.id } },
        );

        const notification = await models.Notification.findOneAndUpdate(
          {
            ownerId: unlikedMessage.userId,
            messageId: unlikedMessage._id,
            userId: me.id,
            action: 'unlike',
          },
          {
            ownerId: unlikedMessage.userId,
            messageId: unlikedMessage._id,
            userId: me.id,
            action: 'unlike',
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );

        pubsub.publish(EVENTS.NOTIFICATION.CREATED, {
          notificationCreated: { notification },
        });

        return !!unlikedMessage;
      },
    ),
    repostMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const message = await models.Message.findById(messageId);
        let originalMessage;

        if (!message.isReposted) {
          originalMessage = message;
        } else {
          //retvitujem retvit
          //nadji original
          originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
        }

        const repostedMessage = await models.Message.create({
          fileId: originalMessage.fileId,
          userId: originalMessage.userId,
          isReposted: true,
          repost: {
            reposterId: ObjectId(me.id),
            originalMessageId: originalMessage.id,
          },
        });

        //tu je greska, saljem staru poruku subskripciji
        //retvitovana poruka uopste ne postoji u bazi
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message: repostedMessage }, //subs treba da ubaci poruku
        });

        const notification = await models.Notification.findOneAndUpdate(
          {
            ownerId: originalMessage.userId,
            messageId: originalMessage.id,
            userId: me.id,
            action: 'repost',
          },
          {
            ownerId: originalMessage.userId,
            messageId: originalMessage.id,
            userId: me.id,
            action: 'repost',
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );

        pubsub.publish(EVENTS.NOTIFICATION.CREATED, {
          notificationCreated: { notification },
        });
        //samo za update rt broja i zeleno
        return !!repostedMessage;
      },
    ),
    unrepostMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const unrepostedMessage = await models.Message.findOneAndUpdate(
          { _id: messageId },
          { $pull: { reposts: { reposterId: me.id } } },
        );
        return !!unrepostedMessage;
      },
    ),
  },

  Message: {
    user: async (message, args, { loaders }) => {
      // loaders iz contexta koji je prosledjen
      return await loaders.user.load(message.userId);
    },
    file: async (message, args, { loaders }) => {
      return await loaders.file.load(message.fileId);
    },
    likesCount: async (message, args, { models }) => {
      const likedMessage = await models.Message.findById(message.id);
      return likedMessage.likesIds?.length || 0;
    },
    isLiked: async (message, args, { models, me }) => {
      if (!me) return false;
      const likedMessage = await models.Message.findById(message.id);
      return likedMessage.likesIds?.includes(me.id) || false;
    },
    repostsCount: async (message, args, { models }) => {
      //originals
      if (!message.isReposted) {
        return await models.Message.find({
          'repost.originalMessageId': message.id,
        }).countDocuments();
      } else {
        //rts
        const originalMessage = await models.Message.findById(
          message.repost.originalMessageId,
        );
        return await models.Message.find({
          'repost.originalMessageId': originalMessage.id,
        }).countDocuments();
      }
    },
    isRepostedByMe: async (message, args, { models, me }) => {
      if (!me) return false;
      if (!message.isReposted) {
        const allRts = await models.Message.find({
          'repost.originalMessageId': message.id,
        });
        const isRepostedByMe = allRts.find(m =>
          m.repost.reposterId.equals(me.id),
        );
        return !!isRepostedByMe;
      } else {
        //rts
        //nadji original
        const originalMessage = await models.Message.findById(
          message.repost.originalMessageId,
        );
        //nadji sve retvitove
        const allRts = await models.Message.find({
          'repost.originalMessageId': originalMessage.id,
        });
        //vidi dal me ima medju reposterima
        const isRepostedByMe = allRts.find(
          m => m.repost.reposterId.equals(me.id), //me nije isti kao u create message???
        );
        return !!isRepostedByMe;
      }
    },
    repost: async (message, args, { models }) => {
      if (!message.isReposted) return null;

      const reposter = await models.User.findById(
        message.repost.reposterId,
      );
      const originalMessage = await models.Message.findById(
        message.repost.originalMessageId,
      );
      return { reposter, originalMessage };
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        async (payload, { username }, { me }) => {
          //console.log(payload);
          const reposterId =
            payload.messageCreated.message.repost.reposterId;
          const reposter = models.User.findById(reposterId);
          const followers = await models.User.find({
            followingIds: { $in: [reposterId] },
          });
          const amIFollowingHim = !!followers.find(
            u => u.username === me.username,
          );
          // username je stranica
          if (
            (!me && !username) || // koji nisu logovani i na glavnom timelineu
            username === reposter.username || //koji su na reposterovom profilu
            amIFollowingHim || //na mom timelineu
            username === me.username //ako sam ja na svom profilu
          )
            return true;
          else return false;
        },
      ),
    },
  },
};
