import { Injectable } from '@nestjs/common';
import 'multer';
import { AudioRepository } from '../domain/audio.repository';
import { AudioFile } from '../domain/audio.entity';
import { AudioStatus as DomainAudioStatus } from '@echomind/shared';
import { AudioFileDto, FileDeleteResponseDto } from '../dto/audio.dto';
import * as fs from 'fs';
import * as path from 'path';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import {
  EntityNotFoundException,
  InsufficientPermissionException,
} from '../../core/error-handling/exceptions/application.exception';

@Injectable()
export class AudioService {
  constructor(
    private readonly audioRepository: AudioRepository,
    @InjectQueue('audio-transcription') private audioQueue: Queue,
  ) {}

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    folderId: string | null,
  ): Promise<AudioFileDto> {
    const storageDir = path.resolve(__dirname, '../../../storage/audio');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    const filePath = path.join(storageDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    try {
      const audioFile = await this.audioRepository.create({
        userId,
        fileName: file.originalname,
        filePath,
        status: DomainAudioStatus.PENDING,
        folderId,
      });

      return this.toAudioFileDto(audioFile);
    } catch (error) {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`[Rollback] Deleted orphaned file: ${filePath}`);
        } catch (unlinkError) {
          console.error(
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
