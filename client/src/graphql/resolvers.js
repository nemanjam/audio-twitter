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
  },
};
