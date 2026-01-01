import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AudioFile } from '../domain/audio.entity';
import { AudioRepository } from '../domain/audio.repository';

@Injectable()
export class AudioPrismaRepository implements AudioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(audio: Omit<AudioFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<AudioFile> {
    const created = await this.prisma.audioFile.create({
      data: {
        userId: audio.userId,
        fileName: audio.fileName,
        filePath: audio.filePath,
        status: audio.status,
        folderId: audio.folderId,
      },
    });
    return new AudioFile(created);
  }

  async findAllByUserId(userId: string): Promise<AudioFile[]> {
    const files = await this.prisma.audioFile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return files.map((f) => new AudioFile(f));
  }

  async findById(id: string): Promise<AudioFile | null> {
    const file = await this.prisma.audioFile.findUnique({
      where: { id },
    });
    if (!file) return null;
    return new AudioFile(file);
  }

  async updateStatus(id: string, status: string): Promise<AudioFile> {
    const updated = await this.prisma.audioFile.update({
      where: { id },
      data: { status },
    });
    return new AudioFile(updated);
  }
}
