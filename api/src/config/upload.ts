import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

type UploadConfig = {
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
};

export default {
  tmpFolder,
  uploadsFolder: path.join(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {
        const filehash = crypto.randomBytes(10).toString('hex');
        const filename = `${filehash}-${file.originalname}`;

        return callback(null, filename);
      },
    }),
  },
} as UploadConfig;
