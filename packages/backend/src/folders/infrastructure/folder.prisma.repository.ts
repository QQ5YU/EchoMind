import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Folder } from '../domain/folder.entity';
import { FolderRepository } from '../domain/folder.repository';

@Injectable()
export class FolderPrismaRepository implements FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(folder: Omit<Folder, 'id' | 'createdAt' | 'children'>): Promise<Folder> {
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
    // This returns a flat list with children populated one level deep. 
    // For a full tree structure, we might need recursive processing, 
    // but the spec just says "possibly nested" and "Retrieves the folder structure".
    // For now, returning the list is fine, frontend can build the tree, 
    // or we can build it here. 
    // Prisma doesn't do deep recursive include easily. 
    // Let's return the flat list of all folders for the user, frontend can reconstruct the tree using parentId.
    return folders.map(f => new Folder(f));
  }
}
