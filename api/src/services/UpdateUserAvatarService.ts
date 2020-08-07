import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import User from '../models/User';
import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarfilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarfilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarfilename;
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
