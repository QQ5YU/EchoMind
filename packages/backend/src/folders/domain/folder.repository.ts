import { Folder } from './folder.entity';

export abstract class FolderRepository {
  abstract create(folder: Omit<Folder, 'id' | 'createdAt' | 'children'>): Promise<Folder>;
  abstract findAllByUserId(userId: string): Promise<Folder[]>;
}
