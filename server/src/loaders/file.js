export const batchFiles = async (keys, models) => {
  const files = await models.File.find({
    _id: {
      $in: keys,
    },
  });
  return keys.map(key => files.find(file => file.id == key));
};
