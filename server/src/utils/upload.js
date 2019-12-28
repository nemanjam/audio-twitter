import { resolve } from 'path';
import { createWriteStream, unlinkSync } from 'fs';
import { sync } from 'mkdirp';
import uuidv4 from 'uuid/v4';
import Message from '../models/message';

const uploadDir = resolve(__dirname, '../../uploads');

// Ensure upload directory exists.
sync(uploadDir);

const storeDB = (userId, text, file) => {
  const { filename, mimetype, path } = file;

  try {
    let message = new Message({
      userId,
      text,
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

  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) unlinkSync(path);
        reject(error);
      })
      .pipe(createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path })),
  );
};

export const processMessage = async (userId, text, file) => {
  const { createReadStream, filename, mimetype } = await file;
  const stream = createReadStream();
  const { path } = await storeFS({ stream, filename });
  return storeDB({ userId, text, filename, mimetype, path });
};
