/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractEntity } from './abstract-entity';
import { IsEmail, IsString } from 'class-validator';
import { Exclude, classToPlain } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
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

  @ManyToMany((type) => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  followee: UserEntity[];

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

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);
    const profile: any = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
