import { AudioFile } from './audio.entity';
import { AudioStatus } from '@echomind/shared';

export abstract class AudioRepository {
  abstract create(
    audio: Omit<AudioFile, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AudioFile>;
  abstract delete(userId: string, id: string): Promise<AudioFile>;
  abstract findAllByUserId(userId: string): Promise<AudioFile[]>;
  abstract findById(id: string): Promise<AudioFile | null>;
  abstract updateStatus(id: string, status: AudioStatus): Promise<AudioFile>;
}
