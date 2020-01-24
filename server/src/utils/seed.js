import models from '../models';

export const createUsersWithMessages = async date => {
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

  // ddavids follows rwieruch
  user1.followersIds.push(user2.id);
  user2.followingIds.push(user1.id);

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
