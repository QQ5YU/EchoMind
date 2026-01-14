import { createZodDto } from 'nestjs-zod';
import {
  CreateFolderSchema,
  FolderSchema,
  FolderDeleteResponseSchema,
} from '@echomind/shared';

export class CreateFolderDto extends createZodDto(CreateFolderSchema) {
  declare name: string;
  declare parentId?: string;
}
export class FolderDto extends createZodDto(FolderSchema) {}
export class FolderDeleteResponseDto extends createZodDto(
  FolderDeleteResponseSchema,
) {}
