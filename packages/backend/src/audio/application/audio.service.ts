import { Injectable, Logger } from '@nestjs/common';
import 'multer';
import { AudioRepository } from '../domain/audio.repository';
import { AudioFile } from '../domain/audio.entity';
import { AudioStatus as DomainAudioStatus } from '@echomind/shared';
import { AudioFileDto, FileDeleteResponseDto } from '../dto/audio.dto';
import * as fs from 'fs';
import * as path from 'path';
import {
  EntityNotFoundException,
  InsufficientPermissionException,
} from '@core/error-handling';
import { AudioProcessor } from './audio.processor';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  constructor(
    private readonly audioRepository: AudioRepository,
    private readonly audioProcessor: AudioProcessor,
  ) {}

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    folderId: string | null,
  ): Promise<AudioFileDto> {
    const storageDir = path.resolve(process.cwd(), 'storage', 'audios');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`;
    const filePath = path.join(storageDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    try {
      const audioFile = await this.audioRepository.create({
        userId,
        fileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
        filePath,
        status: DomainAudioStatus.PENDING,
        folderId,
      });

      await this.audioProcessor.addTranscribeJob(audioFile.id, filePath);

      return this.toAudioFileDto(audioFile);
    } catch (error) {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          this.logger.log(`[Rollback] Deleted orphaned file: ${filePath}`);
        } catch (unlinkError) {
          this.logger.error(
            `[Rollback Failed] Could not delete file: ${filePath}`,
            unlinkError,
          );
        }
      }
      throw error;
    }
  }

  async deleteFile(userId: string, id: string): Promise<FileDeleteResponseDto> {
    const audioFile = await this.audioRepository.delete(userId, id);
    return {
      success: true,
      message: 'File has been deleted.',
      data: this.toAudioFileDto(audioFile),
    };
  }

  async findByIdInternal(id: string): Promise<AudioFile | null> {
    return this.audioRepository.findById(id);
  }

  async findAll(userId: string): Promise<AudioFileDto[]> {
    const files = await this.audioRepository.findAllByUserId(userId);
    return files.map((f) => this.toAudioFileDto(f));
  }

  async findOne(id: string, userId: string): Promise<AudioFileDto> {
    const file = await this.audioRepository.findById(id);

    if (!file) throw new EntityNotFoundException('AudioFile', id);

    if (file.userId !== userId)
      throw new InsufficientPermissionException('Access denied');
    return this.toAudioFileDto(file);
  }

  private toAudioFileDto(audioFile: AudioFile): AudioFileDto {
    return {
      id: audioFile.id,
      userId: audioFile.userId,
      folderId: audioFile.folderId ?? null,
      fileName: audioFile.fileName,
      filePath: audioFile.filePath,
      status: audioFile.status as unknown as DomainAudioStatus,
      createdAt: audioFile.createdAt.toISOString(),
      updatedAt: audioFile.updatedAt.toISOString(),
    };
  }
}
