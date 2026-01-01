import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../domain/users.repository';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
    return new User(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return new User(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new User(user);
  }
}
