import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
      },
    });
    
    return new User({
      ...createdUser,
      name: createdUser.name ?? undefined,
      avatarPath: createdUser.avatarPath ?? undefined,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    
    return new User({
      ...user,
      name: user.name ?? undefined,
      avatarPath: user.avatarPath ?? undefined,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new User({
      ...user,
      name: user.name ?? undefined,
      avatarPath: user.avatarPath ?? undefined,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>,
  ): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return new User({
      ...updated,
      name: updated.name ?? undefined,
      avatarPath: updated.avatarPath ?? undefined,
    });
  }
}
