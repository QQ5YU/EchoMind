import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import {
  EntityNotFoundException,
  FileOperationException,
} from '../../core/error-handling/exceptions/application.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    email: string,
    passwordHash: string,
    name?: string,
  ): Promise<User> {
    return this.userRepository.create({ email, passwordHash, name });
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

    if (user && user.avatarPath) {
      const oldPath = path.join(process.cwd(), user.avatarPath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const uploadDir = path.join(process.cwd(), 'storage', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `avatar-${id}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new FileOperationException(
        'Failed to write avatar file to storage',
      );
    }

    const dbPath = `storage/avatars/${fileName}`;

    return this.userRepository.update(id, { avatarPath: dbPath });
  }

  async getAvatarStream(id: string): Promise<fs.ReadStream> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    if (!user.avatarPath) {
      throw new EntityNotFoundException('Avatar', id);
    }

    const absolutePath = path.join(process.cwd(), user.avatarPath);

    if (!fs.existsSync(absolutePath)) {
      throw new EntityNotFoundException('AvatarFile', absolutePath);
    }

    return fs.createReadStream(absolutePath);
  }
}
