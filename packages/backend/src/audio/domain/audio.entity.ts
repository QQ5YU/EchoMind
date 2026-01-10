import { AudioStatus } from '@echomind/shared';

export class AudioFile {
  id!: string;
  userId!: string;
  folderId!: string | null;
  fileName!: string;
  filePath!: string;
  status!: AudioStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<AudioFile>) {
    Object.assign(this, partial);
  }
}
