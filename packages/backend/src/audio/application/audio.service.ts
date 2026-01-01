import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AudioRepository } from '../domain/audio.repository';
import { AudioFile } from '../domain/audio.entity';
import * as fs from 'fs';
import * as path from 'path';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class AudioService {
  constructor(
    private readonly audioRepository: AudioRepository,
    @InjectQueue('audio-transcription') private audioQueue: Queue,
  ) {}

  async uploadFile(userId: string, file: Express.Multer.File): Promise<AudioFile> {
    const storageDir = path.resolve(__dirname, '../../../storage/audio');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    const filePath = path.join(storageDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const audioFile = await this.audioRepository.create({
      userId,
      fileName: file.originalname,
      filePath,
      status: 'pending',
      folderId: null,
    });

    await this.audioQueue.add('transcribe', {
      audioFileId: audioFile.id,
      filePath: audioFile.filePath,
    });

    return audioFile;
  }

  async findByIdInternal(id: string): Promise<AudioFile | null> {
    return this.audioRepository.findById(id);
  }

  async findAll(userId: string): Promise<AudioFile[]> {
    return this.audioRepository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string): Promise<AudioFile> {
    const file = await this.audioRepository.findById(id);
    if (!file) throw new NotFoundException('Audio file not found');
    if (file.userId !== userId) throw new ForbiddenException('Access denied');
    return file;
  }
}
