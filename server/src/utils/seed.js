import faker from 'faker';
import models from '../models';

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
      bio: faker.lorem.sentence(),
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

  // all users follow user0
  users.map((user, i) => {
    if (i === 0) return;
    users[0].followersIds.push(users[i].id);
    users[i].followingIds.push(users[0].id);
  });

  await Promise.all(users.map(user => user.save()));

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
      createdAt: date.setSeconds(date.getSeconds() + index),
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
};
