import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import notificationSchema from './notification';

const linkSchema = gql`
  scalar Date

  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  messageSchema,
  notificationSchema,
];
