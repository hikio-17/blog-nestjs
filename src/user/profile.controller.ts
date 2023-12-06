import {
  Controller,
  NotFoundException,
  Param,
  Get,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get(':username')
  async findProfile(@Param('username') username: string) {
    const profile = await this.userService.findByUsername(username);

    if (!profile) {
      throw new NotFoundException();
    }

    return { profile };
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.unfollowUser(user, username);

    return { profile };
  }
}
