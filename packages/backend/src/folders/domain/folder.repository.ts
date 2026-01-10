import { Folder } from './folder.entity';
import { FolderDeleteResponseDto } from '@echomind/shared';

export abstract class FolderRepository {
  abstract create(
    folder: Omit<Folder, 'id' | 'createdAt' | 'children'>,
  ): Promise<Folder>;
  abstract findAllByUserId(userId: string): Promise<Folder[]>;
  abstract delete(userId: string, id: string): Promise<FolderDeleteResponseDto>;
}