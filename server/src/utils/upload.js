import { resolve } from 'path';
import { createWriteStream, unlinkSync } from 'fs';
import { sync } from 'mkdirp';
import uuidv4 from 'uuid/v4';
import Message from '../models/message';

const uploadDir = resolve(__dirname, '../../uploads');

// Ensure upload directory exists.
sync(uploadDir);

const storeDB = args => {
  const { userId, text, filename, mimetype, path } = args;

  try {
    let message = new Message({
      userId,
      filename,
      mimetype,
      path,
    });
    return message.save();
  } catch (err) {
    return err;
  }
};

const storeFS = ({ stream, filename }) => {
  const id = uuidv4();
  const path = `${uploadDir}/${id}-${filename}`;
  const webPath = `${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) unlinkSync(path);
        reject(error);
      })
      .pipe(createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ webPath })),
  );
};

export const processMessage = async (userId, file) => {
  const { createReadStream, filename, mimetype } = await file;
  const stream = createReadStream();
  const { webPath } = await storeFS({ stream, filename });
  return storeDB({ userId, filename, mimetype, path: webPath });
};
