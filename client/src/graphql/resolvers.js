import { GET_AUTOPLAY } from './queries';

export default {
  Query: {
    // autoplay: (_root, _args, { cache }) => {
    //   const autoplay = cache.readQuery({ query: GET_AUTOPLAY });
    //   console.log('autoplay resolver', autoplay);
    //   return autoplay;
    // },
  },
  Mutation: {
    updateAutoplay: (
      _root,
      { direction, createdAt, duration },
      { cache, getCacheKey },
    ) => {
      //   const previous = cache.readQuery({ query: GET_AUTOPLAY });
      //   console.log('previous', previous);
      //to je fora, mora autoplay, vidis format cache objekta sa readQuery
      const data = {
        autoplay: {
          direction,
          createdAt,
          duration,
          __typename: 'Autoplay',
        },
      };
      cache.writeData({ data });
    },
    setTheme: (_root, { type, color }, { cache, getCacheKey }) => {
      const data = {
        theme: {
          type,
          color,
          __typename: 'Theme',
        },
      };
      cache.writeData({ data });
    },
    setRefetchFollowers: (_root, args, { cache, getCacheKey }) => {
      const data = {
        refetchFollowers: {
          signal: Math.floor(Math.random() * 1000),
          __typename: 'Int',
        },
      };
      cache.writeData({ data });
    },
    setMessagesVariables: (
      _root,
      { username, cursor, limit },
      { cache, getCacheKey },
    ) => {
      const data = {
        messagesVariables: {
          username,
          cursor,
          limit,
          __typename: 'MessagesVariables',
        },
      };
      cache.writeData({ data });
    },
  },
};
