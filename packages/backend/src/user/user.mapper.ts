import { Injectable } from '@nestjs/common';
import { User } from './domain/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserMapper {
  toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: this.generateAvatarUrl(user),
      createdAt: user.createdAt.toISOString(),
    };
  }

  private generateAvatarUrl(user: User): string | null {
    if (!user.avatarPath || !user.avatarUpdatedAt) {
      return null;
    }
    return `/api/user/avatar/${user.id}?v=${user.avatarUpdatedAt.getTime()}`;
  }
}
