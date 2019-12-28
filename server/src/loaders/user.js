// BATCHING JE: loader pretvara puno manjih sql upit u jedan slozeniji
// cacheing je caching
export const batchUsers = async (keys, models) => {
  const users = await models.User.find({
    _id: {
      $in: keys,
    },
  });

  // isti redosled usera kao u keys
  return keys.map(key => users.find(user => user.id == key));
};
