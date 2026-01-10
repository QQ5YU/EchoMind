import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Folder } from '../domain/folder.entity';
import { FolderRepository } from '../domain/folder.repository';
import { Prisma } from '@prisma/client';
import { FolderDeleteResponseDto } from '@echomind/shared';

@Injectable()
export class FolderPrismaRepository implements FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    folder: Omit<Folder, 'id' | 'createdAt' | 'children'>,
  ): Promise<Folder> {
    const created = await this.prisma.folder.create({
      data: {
        userId: folder.userId,
        name: folder.name,
        parentId: folder.parentId,
      },
    });
    return new Folder(created);
  }

  async findAllByUserId(userId: string): Promise<Folder[]> {
    const folders = await this.prisma.folder.findMany({
      where: { userId },
      include: { children: true },
    });

    return folders.map((f) => new Folder(f));
  }

  async delete(userId: string, id: string): Promise<FolderDeleteResponseDto> {
    try {
      const deleted = await this.prisma.folder.delete({
        where: { id, userId },
      });

      return {
        success: true,
        message: 'Folder has been deleted.',
        data: deleted,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Folder does not exist.');
          case 'P2003':
            throw new BadRequestException(
              'Cannot delete folder: it contains files or subfolders.',
            );
          default:
            throw new InternalServerErrorException('Failed to delete folder.');
        }
      }

      throw error;
    }
  }
}
