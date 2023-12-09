/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationCount,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import * as slugify from 'slug';
import { classToPlain } from 'class-transformer';
import { UserEntity } from './user.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany((type) => UserEntity, (user) => user.favorites, { eager: true })
  @JoinTable()
  favoritedBy: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJson() {
    return classToPlain(this);
  }

  toArticle(user?: UserEntity) {
    let favorited = null;

    if (user) {
      favorited = this.favoritedBy.map((user) => user.id).includes(user.id);
    }
    const article: any = this.toJson();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
