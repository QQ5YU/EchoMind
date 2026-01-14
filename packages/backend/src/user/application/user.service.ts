import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(email: string, passwordHash: string, name?: string): Promise<User> {
    return this.userRepository.create({ email, passwordHash, name });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateProfile(id: string, name?: string): Promise<User> {
    return this.userRepository.update(id, { name });
  }
}