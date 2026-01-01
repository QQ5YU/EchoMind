export class AudioFile {
  id: string;
  userId: string;
  folderId: string | null;
  fileName: string;
  filePath: string;
  status: string; // 'pending' | 'processing' | 'processed' | 'error'
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AudioFile>) {
    Object.assign(this, partial);
  }
}
