import mongoose, { models } from 'mongoose';
import { combineResolvers } from 'graphql-resolvers';
import { withFilter } from 'apollo-server';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';
import { processFile, deleteFile } from '../utils/upload';
const ObjectId = mongoose.Types.ObjectId;

// to base64, da klijent aplikacija ne bi radila sa datumom nego sa stringom
const toCursorHash = string =>
  string ? Buffer.from(string).toString('base64') : '';

// from base64
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

const publishMessageNotification = async (message, me, action) => {
  const notification = await models.Notification.create({
    ownerId: message.userId,
    messageId: message.id,
    userId: me.id,
    action,
  });

  await pubsub.publish(EVENTS.NOTIFICATION.CREATED, {
    notificationCreated: { notification },
  });

  const unseenNotificationsCount = await models.Notification.find({
    ownerId: notification.ownerId,
    isSeen: false,
  }).countDocuments();

  console.log('unseenNotificationsCount', unseenNotificationsCount);

  await pubsub.publish(EVENTS.NOTIFICATION.NOT_SEEN_UPDATED, {
    notSeenUpdated: unseenNotificationsCount,
    notification,
  });
};

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

      // console.log(cursor, cursorTime);

      const match = {
        // za prvi upit ne treba cursor
        ...(cursorTime && {
          createdAt: {
            $lt: cursorTime, //MORA NEW DATE(), sa toISOString ne radi
          },
        }),
        // user page
        ...(!!user && {
          $or: [
            {
              userId: user._id, //njegovi
            },
            {
              'repost.reposterId': user._id, // ili tudji koje je on rt
            },
          ],
        }),
        // timeline, see messages only from following and me
        ...(!!meUser &&
          !username && {
            $or: [
              {
                userId: {
                  $in: [...meUser.followingIds, meUser._id],
                },
              },
              {
                'reposts.reposterId': {
                  $in: [...meUser.followingIds, meUser._id], //rt-ovi onih koje pratim i moji
                },
              },
            ],
          }),
        ...(!meUser && !username && {}), //timeline for non loged user, all tweets
      };
      // console.log(match);

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
            edges[edges.length - 1]?.createdAt?.toString(),
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
      async (parent, { messageId }, { models }) => {
        const message = await models.Message.findById(messageId);
        if (!message) return false;

        let originalMessage = message;
        if (message.isReposted) {
          originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
        }
        //nadji sve rt, obrisi njih + original
        const allRepostsIds = await models.Message.find(
          {
            'repost.originalMessageId': originalMessage.id,
          },
          '_id',
        );

        // DELETE FILE
        const file = await models.File.findById(
          originalMessage.fileId,
        );
        if (file.path !== 'test.mp3') deleteFile(file.path);

        await models.Message.deleteMany({
          _id: {
            $in: [
              ...allRepostsIds.map(i => i._id),
              originalMessage.id,
            ],
          },
        });
        return true;
      },
    ),

    likeMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        //da li je original
        const message = await models.Message.findById(messageId);
        if (!message) return false;

        let originalMessage = message;
        if (message.isReposted) {
          originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
        }
        //nadji sve retvitove te poruke
        const allRepostsIds = await models.Message.find(
          {
            'repost.originalMessageId': originalMessage.id,
          },
          '_id',
        );
        await models.Message.updateMany(
          {
            _id: {
              $in: [
                ...allRepostsIds.map(i => i._id),
                originalMessage.id,
              ],
            },
          },
          { $push: { likesIds: me.id } },
        );

        await publishMessageNotification(originalMessage, me, 'like');

        return !!originalMessage;
      },
    ),
    unlikeMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        //identicno, samo pull
        const message = await models.Message.findById(messageId);
        if (!message) return false;

        let originalMessage = message;
        if (message.isReposted) {
          originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
        }
        const allRepostsIds = await models.Message.find(
          {
            'repost.originalMessageId': originalMessage,
          },
          '_id',
        );
        await models.Message.updateMany(
          {
            _id: {
              $in: [
                ...allRepostsIds.map(i => i._id),
                originalMessage.id,
              ],
            },
          },
          { $pull: { likesIds: me.id } },
        );

        await publishMessageNotification(
          originalMessage,
          me,
          'unlike',
        );

        return !!originalMessage;
      },
    ),
    repostMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const message = await models.Message.findById(messageId);
        let originalMessage = message;

        if (message.isReposted) {
          //retvitujem retvit
          originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
        }

        const repostedMessage = await models.Message.create({
          fileId: originalMessage.fileId,
          userId: originalMessage.userId,
          likesIds: originalMessage.likesIds,
          isReposted: true,
          repost: {
            reposterId: ObjectId(me.id),
            originalMessageId: originalMessage.id,
          },
        });

        //tu je greska, saljem staru poruku subskripciji
        // retvitovana poruka uopste ne postoji u bazi
        // pubsub.publish(EVENTS.MESSAGE.CREATED, {
        //   messageCreated: { message: repostedMessage }, //subs treba da ubaci poruku
        // });
        await publishMessageNotification(
          originalMessage,
          me,
          'repost',
        );
        //samo za update rt broja i zeleno
        return !!repostedMessage;
      },
    ),
    unrepostMessage: combineResolvers(
      isAuthenticated,
      async (parent, { messageId }, { models, me }) => {
        const message = await models.Message.findById(messageId);

        //unrepost moj rt tudjeg rta
        const myRepost = await models.Message.findOne({
          'repost.originalMessageId': message.id,
          'repost.reposterId': me.id,
        });

        if (myRepost) {
          await publishMessageNotification(message, me, 'unrepost');
          await myRepost.remove();
          return true;
        } else {
          const originalMessage = await models.Message.findById(
            message.repost.originalMessageId,
          );
          await publishMessageNotification(
            originalMessage,
            me,
            'unrepost',
          );
          await message.remove();
          return true;
        }
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
      return !!likedMessage.likesIds?.includes(me.id) || false; //ista greska me nije dobar
    },
    repostsCount: async (message, args, { models }) => {
      let originalMessage = message;
      if (message.isReposted) {
        //rts
        originalMessage = await models.Message.findById(
          message.repost.originalMessageId,
        );
      }
      return await models.Message.find({
        'repost.originalMessageId': originalMessage.id,
      }).countDocuments();
    },
    isRepostedByMe: async (message, args, { models, me }) => {
      if (!me) return false;
      let originalMessage = message;
      if (message.isReposted) {
        //rts
        //nadji original
        originalMessage = await models.Message.findById(
          message.repost.originalMessageId,
        );
      }
      //nadji retvit
      const isRepostedByMe = await models.Message.findOne({
        'repost.originalMessageId': originalMessage.id,
        'repost.reposterId': me.id,
      });

      return !!isRepostedByMe;
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
  //za nelogovanog ne radi ni timeline ni profile
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        async (payload, { username }, { me }) => {
          //console.log(payload);
          if (payload.messageCreated.message.isReposted) {
            const reposterId =
              payload.messageCreated.message.repost.reposterId;
            const reposter = await models.User.findById(reposterId);
            const followers = await models.User.find({
              followingIds: { $in: [reposterId] },
            });
            const amIFollowingHim = !!followers.find(
              u => u.username === me.username,
            );
            // username je stranica
            const cond1 = !me && !username; // koji nisu logovani i na glavnom timelineu
            const cond2 =
              !!username && username === reposter.username; //koji su na reposterovom profilu
            const cond3 =
              !username &&
              (amIFollowingHim || reposter.username === me.username); //na mom timelineu
            const cond4 = username === me.username; //ako sam ja na svom profilu
            console.log('repost ', cond1, cond2, cond3, cond4);

            if (cond1 || cond2 || cond3 || cond4) return true;
            else return false;
          } else {
            const userId = payload.messageCreated.message.userId;
            const user = await models.User.findById(userId);
            const followers = await models.User.find({
              followingIds: { $in: [userId] },
            });
            const amIFollowingHim = !!followers.find(
              u => u.username === me.username,
            );

            const cond1 = !me && !username; // koji nisu logovani i na glavnom timelineu
            const cond2 = !!username && username === user.username; //koji su na userovom profilu
            const cond3 =
              !username &&
              (amIFollowingHim || user.username === me.username); //na mom timelineu
            const cond4 = username === me.username; //ako sam ja na svom profilu
            console.log('user message ', cond1, cond2, cond3, cond4);
            if (cond1 || cond2 || cond3 || cond4) return true;
            else return false;
          }
        },
      ),
    },
  },
};
