/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  RelationCount,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import * as slugify from 'slug';
import { classToPlain } from 'class-transformer';
import { UserEntity } from './user.entity';

@Entity('aarticles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column('simple-array')
  tags: string[];

  @ManyToMany((type) => UserEntity, (user) => user.favorites, { eager: true })
  @JoinColumn()
  favoritedBy: UserEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  @Column()
  author: string;

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

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

  toArticle(user: UserEntity) {
    let favorited = null;

    if (user) {
      favorited = this.favoritedBy.includes(user);
    }
    const article: any = this.toJson();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
