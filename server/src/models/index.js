import mongoose from 'mongoose';
//mongoose.set('debug', true);

import User from './user';
import Message from './message';
import File from './file';

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    mongoose.set('useCreateIndex', true);
    return mongoose.connection;
  }

  if (process.env.DATABASE_URL) {
    mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    mongoose.set('useCreateIndex', true);
    return mongoose.connection;
  }
};

const models = { User, Message, File };

export { connectDb };

export default models;
