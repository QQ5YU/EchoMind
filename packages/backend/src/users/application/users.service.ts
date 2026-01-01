import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../domain/users.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, passwordHash: string): Promise<User> {
    return this.usersRepository.create({ email, passwordHash });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
