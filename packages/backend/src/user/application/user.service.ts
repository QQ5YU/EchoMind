import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import * as path from 'path';
import { StorageService } from '../../core/storage/storage.service';
import {
  EntityNotFoundException,
  FileOperationException,
} from '../../core/error-handling/exceptions/application.exception';
import { ReadStream } from 'fs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(
    email: string,
    passwordHash: string,
    name?: string,
  ): Promise<User> {
    return this.userRepository.create({
      email,
      passwordHash,
      name,
      avatarPath: null,
      avatarUpdatedAt: null,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateProfile(id: string, name?: string): Promise<User> {
    return this.userRepository.update(id, { name });
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new EntityNotFoundException('User', id);

    if (user.avatarPath) {
      await this.storageService.delete(user.avatarPath);
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `avatar-${id}${fileExt}`;
    const relativePath = `storage/avatars/${fileName}`;

    try {
      await this.storageService.save(relativePath, file.buffer);
    } catch (error) {
      throw new FileOperationException(
        'Failed to write avatar file to storage',
      );
    }

    return this.userRepository.update(id, {
      avatarPath: relativePath,
      avatarUpdatedAt: new Date(),
    });
  }

  async getAvatarStream(id: string): Promise<ReadStream> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    if (!user.avatarPath) {
      throw new EntityNotFoundException('Avatar', id);
    }

    try {
      return this.storageService.getReadStream(user.avatarPath);
    } catch (error) {
      throw new EntityNotFoundException('AvatarFile', user.avatarPath);
    }
  }
}
