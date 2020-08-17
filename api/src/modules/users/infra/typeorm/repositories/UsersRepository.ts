import { Repository, getRepository } from 'typeorm';

import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByLogin(login: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { login } });
  }

  public async findByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: [{ email }, { login }] });
  }

  public async create({
    name,
    email,
    login,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, login, password });
    return this.ormRepository.save(user);
  }

  public async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
