import { Folder } from './folder.entity';

export abstract class FolderRepository {
  abstract create(
    folder: Omit<Folder, 'id' | 'createdAt' | 'children'>,
  ): Promise<Folder>;
  abstract findOne(
    userId: string,
    name: string,
    parentId?: string,
  ): Promise<Folder | null>;
  abstract findAllByUserId(userId: string): Promise<Folder[]>;
  abstract delete(userId: string, id: string): Promise<Folder>;
}
