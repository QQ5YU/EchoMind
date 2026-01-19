import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/auth.dto';
import { User } from '../../user/domain/user.entity';
import { AuthResponseDto } from '@echomind/shared';
import { DuplicateEntityException } from '../../core/error-handling/exceptions/application.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarPath: user.avatarPath,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userService.findByEmail(
      registerDto.email!,
    );

    if (existingUser) {
      throw new DuplicateEntityException('User', 'email');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password!, salt);

    const user = await this.userService.create(
      registerDto.email!,
      passwordHash,
      registerDto.name,
    );

    return this.login(user);
  }
}
