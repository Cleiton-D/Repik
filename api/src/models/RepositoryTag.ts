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

import Repository from './Repository';
import TagHistoric from './TagHistoric';

@Entity('repository_tags')
class RepositoryTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  digest: string;

  @Column()
  repository_id: string;

  @ManyToOne(() => Repository, repository => repository.tag, { eager: true })
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => TagHistoric, historic => historic.tag)
  historic: TagHistoric;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RepositoryTag;
