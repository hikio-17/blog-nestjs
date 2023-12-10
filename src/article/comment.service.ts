import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO } from 'src/models/comment.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async findByArticleSlug(slug: string) {
    return await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .where('article.slug = :slug', { slug })
      .getMany();
  }

  async findById(id: number) {
    return await this.commentRepo.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = await this.commentRepo.create(data);
    comment.author = user;
    await comment.save();
    return comment;
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = await this.commentRepo
      .createQueryBuilder('comment')
      .where('comment.id = :id AND comment.author.id = :userId', {
        id,
        userId: user.id,
      })
      .getOne();

    if (comment) {
      await this.commentRepo.remove(comment);
      return comment;
    } else {
      // Handle jika comment tidak ditemukan
      return null;
    }
  }
}
