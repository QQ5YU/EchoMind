import { Injectable } from '@nestjs/common';
import { FolderRepository } from '../domain/folder.repository';
import { Folder } from '../domain/folder.entity';
import { FolderDeleteResponseDto } from '@echomind/shared';

@Injectable()
export class FoldersService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async create(
    userId: string,
    name: string,
    parentId?: string,
  ): Promise<Folder> {
    return this.folderRepository.create({
      userId,
      name,
      parentId: parentId || null,
    });
  }

  async findAll(userId: string): Promise<Folder[]> {
    return this.folderRepository.findAllByUserId(userId);
  }

  async delete(userId: string, id: string): Promise<FolderDeleteResponseDto> {
    return this.folderRepository.delete(userId, id);
  }
}
