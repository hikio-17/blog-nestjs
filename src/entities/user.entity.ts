import { AbstractEntity } from './abstract-entity';
import { IsEmail, IsString } from 'class-validator';
import { Exclude, classToPlain } from 'class-transformer';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column()
  @IsEmail()
  @IsString()
  email: string;

  @Column({ unique: true })
  @IsString()
  username: string;

  @Column({ default: '' })
  @IsString()
  bio: string;

  @Column({ default: null, nullable: true })
  image: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}
