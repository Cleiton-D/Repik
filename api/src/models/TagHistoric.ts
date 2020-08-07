import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import User from './User';
import RepositoryTag from './RepositoryTag';

@Entity('tag_historics')
class TagHistoric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_id: string;

  @Column()
  event_timestamp: string;

  @Column()
  action: string;

  @Column()
  tag_id: string;

  @ManyToOne(() => RepositoryTag, repositoryTag => repositoryTag.historic, {
    eager: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: RepositoryTag;

  @Column()
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}

export default TagHistoric;
