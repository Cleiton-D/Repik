import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

type Request = {
  user_id: string;
  avatarfilename: string;
};

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarfilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarfilename);

    user.avatar = filename;
    return this.usersRepository.update(user);
  }
}

export default UpdateUserAvatarService;
