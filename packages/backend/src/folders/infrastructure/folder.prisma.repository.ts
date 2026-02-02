import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma';
import { Folder, FolderRepository } from '../domain';
import { Prisma } from '@prisma/client';
import {
  DuplicateEntityException,
  EntityNotFoundException,
} from '@core/error-handling';

@Injectable()
export class FolderPrismaRepository implements FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    folder: Omit<Folder, 'id' | 'createdAt' | 'children'>,
  ): Promise<Folder> {
    try {
      const created = await this.prisma.folder.create({
        data: {
          userId: folder.userId,
          name: folder.name,
          parentId: folder.parentId,
        },
      });
      return new Folder(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateEntityException('Folder', 'name');
        }
      }
      throw error;
    }
  }

  async findOne(
    userId: string,
    name: string,
    parentId?: string,
  ): Promise<Folder | null> {
    const folder = this.prisma.folder.findFirst({
      where: {
        userId,
        name,
        parentId: parentId || null,
      },
    });

    return folder;
  }

  async findAllByUserId(userId: string): Promise<Folder[]> {
    const folders = await this.prisma.folder.findMany({
      where: { userId },
      include: { children: true },
    });

    return folders.map((f: any) => new Folder(f));
  }

  async delete(userId: string, id: string): Promise<Folder> {
    try {
      const deleted = await this.prisma.folder.delete({
        where: { id, userId },
      });

      return new Folder(deleted);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new EntityNotFoundException('Folder', id);
        }
      }
      throw error;
    }
  }
}
