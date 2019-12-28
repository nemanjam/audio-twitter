import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers'; //middleware, skip kao next() u express

// ovo su sve resolveri, middleware,
// da se makne logika iz pravih resolvera koji samo fetchuju data iz baze

//  whether the user is able to delete a message (permission-based authorization), samo svoju
// and whether a user is able to delete a user (role-based authorization), rola admin

// za create message, samo logovan moze da kreira message
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

// za delete user, samo admin moze da delete user
export const isAdmin = combineResolvers(
  isAuthenticated, // ovde is auth middleware, ne u resolveru, da bi mogao me da ima
  (parent, args, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);

// samo owner moze da delete svoju poruku
export const isMessageOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const message = await models.Message.findById(id);

  if (message.userId != me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};
