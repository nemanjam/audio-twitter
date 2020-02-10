import mongoose from 'mongoose';
import faker from 'faker';
import models from '../models';
// import moment from 'moment';
const ObjectId = mongoose.Types.ObjectId;

export const createUsersWithMessages = async date => {
  console.log('seeding automated...');

  // 10 users
  const usersPromises = [...Array(10).keys()].map((index, i) => {
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

    const user1 = new models.User({
      username: `user${index}`,
      email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      bio: faker.lorem.sentences(3),
      avatarId: avatar1.id,
      coverId: cover1.id,
    });

    if (index === 0) {
      user1.role = 'ADMIN';
    }

    return { avatar1, cover1, user1 };
  });

  await Promise.all(
    usersPromises.map(async user => {
      await Promise.all([
        user.avatar1.save(),
        user.cover1.save(),
        user.user1.save(),
      ]);
    }),
  );

  const users = await models.User.find();
  const followersIdsArr = users.map(user => user.id).slice(1);

  // all users follow user0
  await models.User.updateMany(
    { _id: { $ne: users[0].id } },
    { $push: { followingIds: users[0].id } },
  );
  await models.User.updateOne(
    { _id: users[0].id },
    { $push: { followersIds: followersIdsArr } },
  );

  // 30 messages, every user 3 messages
  const messagesPromises = [...Array(30).keys()].map((index, i) => {
    const audio1 = new models.File({
      path: 'test.mp3',
      mimetype: 'audio/mpeg',
      filename: 'test.mp3',
    });
    const userId = users[index % 10]._id;
    const message1 = new models.Message({
      fileId: audio1.id,
      userId: userId,
      createdAt: date.setSeconds(date.getSeconds() - index),
    });
    return { audio1, message1 };
  });

  await Promise.all(
    messagesPromises.map(async message => {
      await Promise.all([
        message.audio1.save(),
        message.message1.save(),
      ]);
    }),
  );

  // like one message from each user and create notification
  // get one message from each user
  //const messages = await models.Message.find({ distinct: 'userId' });

  const messages = await models.Message.aggregate([
    {
      $group: {
        _id: '$userId',
        docs: {
          $first: {
            _id: '$_id',
            userId: '$userId',
            likesIds: '$likesIds',
          },
        },
      },
    },
  ]);

  //console.log(messages.length);

  messages.map(async m => {
    //console.log(m.docs);

    await models.Message.updateOne(
      { _id: m.docs._id },
      { $push: { likesIds: m.docs.userId } },
    );

    const notificationsLikes = await models.Notification.create({
      action: 'like',
      ownerId: m.docs.userId,
      messageId: m.docs._id,
      userId: m.docs.userId,
    });
  });
  // const notifications = await models.Notification.find();
  //console.log(notifications);

  //repost one message
  messages.slice(0, 1).map(async m => {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);

    const originalMessage = await models.Message.findById(m.docs._id);

    const repostedMessage = await models.Message.create({
      fileId: originalMessage.fileId,
      userId: originalMessage.userId,
      isReposted: true,
      repost: {
        reposterId: originalMessage.userId,
        originalMessageId: originalMessage.id,
      },
    });
  });
}; //
