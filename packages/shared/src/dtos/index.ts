import { AudioStatus } from '../enums/audio-status.enum';

export interface AudioFileDto {
  id: string;
  userId: string;
  folderId: string | null;
  fileName: string;
  filePath: string;
  status: AudioStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FolderDto {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  createdAt: string | Date;
  children?: FolderDto[];
}

export interface FolderDeleteResponseDto {
  success: boolean;
  message: string;
  data: FolderDto;
}
