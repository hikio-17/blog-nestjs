/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';
import { classToPlain } from 'class-transformer';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne((type) => UserEntity, (user) => user.comments, { eager: true })
  // @JoinColumn({ name: 'author' })
  author: UserEntity;

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  toJSON() {
    return classToPlain(this);
  }
}
