import { Injectable } from '@nestjs/common';
import { FolderRepository } from '../domain/folder.repository';
import { Folder } from '../domain/folder.entity';
import { FolderDeleteResponseDto, FolderDto } from '../dto/folders.dto';
import { DuplicateEntityException } from 'src/core/error-handling';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoldersService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async create(
    userId: string,
    name: string,
    parentId?: string,
  ): Promise<FolderDto> {
    const existingFolder = await this.folderRepository.findOne(
      userId,
      name,
      parentId,
    );

    if (existingFolder) {
      throw new DuplicateEntityException('folder', 'name');
    }

    try {
      const folder = await this.folderRepository.create({
        userId,
        name,
        parentId: parentId || null,
      });

      return this.toFolderDto(folder);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new DuplicateEntityException('folder', 'name');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<FolderDto[]> {
    const folders = await this.folderRepository.findAllByUserId(userId);
    return folders.map((f) => this.toFolderDto(f));
  }

  async delete(userId: string, id: string): Promise<FolderDeleteResponseDto> {
    const folder = await this.folderRepository.delete(userId, id);
    return {
      success: true,
      message: 'Folder has been deleted.',
      data: this.toFolderDto(folder),
    };
  }

  private toFolderDto(folder: Folder): FolderDto {
    return {
      id: folder.id,
      userId: folder.userId,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt.toISOString(),
      children: folder.children
        ? folder.children.map((c) => this.toFolderDto(c))
        : undefined,
    };
  }
}
