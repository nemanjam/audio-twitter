import mongoose from 'mongoose';

import User from './user';
import Message from './message';

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
    });
    mongoose.set('useCreateIndex', true);
    return mongoose.connection;
  }

  if (process.env.DATABASE_URL) {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    });
    mongoose.set('useCreateIndex', true);
    return mongoose.connection;
  }
};

const models = { User, Message };

export { connectDb };

export default models;
