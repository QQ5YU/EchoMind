import { AudioFile } from './audio.entity';

export abstract class AudioRepository {
  abstract create(audio: Omit<AudioFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<AudioFile>;
  abstract findAllByUserId(userId: string): Promise<AudioFile[]>;
  abstract findById(id: string): Promise<AudioFile | null>;
  abstract updateStatus(id: string, status: string): Promise<AudioFile>;
}
