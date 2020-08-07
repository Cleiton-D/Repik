import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import User from './User';
import RepositoryTag from './RepositoryTag';

@Entity('repositories')
class Repository {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  private: boolean;

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.repository, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => RepositoryTag, repositoryTag => repositoryTag.repository)
  tag: RepositoryTag;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Repository;
