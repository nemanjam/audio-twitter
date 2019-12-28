import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver, // datum umesto stringa broja sekundi, Date scalar
  userResolvers,
  messageResolvers,
];
