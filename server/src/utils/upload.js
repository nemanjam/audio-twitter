import { resolve } from 'path';
import { createWriteStream, unlinkSync } from 'fs';
import { sync } from 'mkdirp';
import uuidv4 from 'uuid/v4';
import File from '../models/file';

const uploadAudioDir = resolve(__dirname, '../../uploads/audio');
const uploadImagesDir = resolve(__dirname, '../../uploads/images');

// Ensure upload directory exists.
sync(uploadAudioDir);
sync(uploadImagesDir);

const storeDB = args => {
  const { filename, mimetype, path } = args;

  try {
    const file = new File({
      filename,
      mimetype,
      path,
    });
    return file.save();
  } catch (err) {
    return err;
  }
};

const storeFS = ({ stream, filename, mimetype }) => {
  const id = uuidv4();
  let path;
  if (mimetype.includes('audio'))
    path = `${uploadAudioDir}/${id}-${filename}`;
  else path = `${uploadImagesDir}/${id}-${filename}`;

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

export const processFile = async file => {
  const fileData = await file;
  // console.log(fileData);
  const { createReadStream, filename, mimetype } = fileData;
  const stream = createReadStream();
  const { webPath } = await storeFS({ stream, filename, mimetype });
  return storeDB({ filename, mimetype, path: webPath });
};

export const deleteFile = fileName => {
  try {
    const path = `${uploadAudioDir}/${fileName}`;
    console.log(`delting file: ${path}`);
    unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
};
