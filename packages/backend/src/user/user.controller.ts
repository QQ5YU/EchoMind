import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './application/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto, UpdateUserDto } from './dto/user.dto';
import { EntityNotFoundException } from '../core/error-handling/exceptions/application.exception';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getProfile(@Request() req: RequestWithUser): Promise<UserDto> {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new EntityNotFoundException('User', req.user.userId);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('info')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.updateProfile(req.user.userId, body.name);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}