import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AudioFile } from '../domain/audio.entity';
import { AudioRepository } from '../domain/audio.repository';
import { AudioStatus as DomainAudioStatus } from '@echomind/shared';
import { AudioStatus as PrismaAudioStatus } from '@prisma/client';

@Injectable()
export class AudioPrismaRepository implements AudioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(audio: Omit<AudioFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<AudioFile> {
    const created = await this.prisma.audioFile.create({
      data: {
        userId: audio.userId,
        fileName: audio.fileName,
        filePath: audio.filePath,
        status: audio.status as unknown as PrismaAudioStatus,
        folderId: audio.folderId,
      },
    });
    return new AudioFile({ ...created, status: created.status as unknown as DomainAudioStatus });
  }

  async findAllByUserId(userId: string): Promise<AudioFile[]> {
    const files = await this.prisma.audioFile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return files.map((f) => new AudioFile({ ...f, status: f.status as unknown as DomainAudioStatus }));
  }

  async findById(id: string): Promise<AudioFile | null> {
    const file = await this.prisma.audioFile.findUnique({
      where: { id },
    });
    if (!file) return null;
    return new AudioFile({ ...file, status: file.status as unknown as DomainAudioStatus });
  }

  async updateStatus(id: string, status: DomainAudioStatus): Promise<AudioFile> {
    const updated = await this.prisma.audioFile.update({
      where: { id },
      data: { status: status as unknown as PrismaAudioStatus },
    });
    return new AudioFile({ ...updated, status: updated.status as unknown as DomainAudioStatus });
  }
}
