import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UploadUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, login, password } = request.body;

  const createUser = new CreateUserService();
  const user = await createUser.execute({ name, email, login, password });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('file'),
  async (request, response) => {
    const uploadUserAvatar = new UploadUserAvatarService();
    const user = await uploadUserAvatar.execute({
      user_id: request.user.id,
      avatarfilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
