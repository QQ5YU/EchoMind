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
