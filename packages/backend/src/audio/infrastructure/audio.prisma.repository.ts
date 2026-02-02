import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma';
import { AudioFile, AudioRepository } from '../domain';
import { AudioStatus as DomainAudioStatus } from '@echomind/shared';
import { Prisma } from '@prisma/client';
import { EntityNotFoundException } from '@core/error-handling';

@Injectable()
export class AudioPrismaRepository implements AudioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    audioFile: Omit<AudioFile, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AudioFile> {
    const created = await this.prisma.audioFile.create({
      data: {
        userId: audioFile.userId,
        fileName: audioFile.fileName,
        filePath: audioFile.filePath,
        status: audioFile.status,
        folderId: audioFile.folderId,
      },
    });

    return new AudioFile({
      ...created,
      status: created.status as unknown as DomainAudioStatus,
    });
  }

  async delete(userId: string, id: string): Promise<AudioFile> {
    try {
      const deleted = await this.prisma.audioFile.delete({
        where: { userId, id },
      });

      return new AudioFile({
        ...deleted,
        status: deleted.status as unknown as DomainAudioStatus,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new EntityNotFoundException('AudioFile', id);
        }
      }
      throw error;
    }
  }

  async findAllByUserId(userId: string): Promise<AudioFile[]> {
    const files = await this.prisma.audioFile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return files.map(
      (f: any) =>
        new AudioFile({
          ...f,
          status: f.status as unknown as DomainAudioStatus,
        }),
    );
  }

  async findById(id: string): Promise<AudioFile | null> {
    const file = await this.prisma.audioFile.findUnique({
      where: { id },
    });
    if (!file) return null;
    return new AudioFile({
      ...file,
      status: file.status as unknown as DomainAudioStatus,
    });
  }

  async updateStatus(
    id: string,
    status: DomainAudioStatus,
  ): Promise<AudioFile> {
    const updated = await this.prisma.audioFile.update({
      where: { id },
      data: { status: status },
    });
    return new AudioFile({
      ...updated,
      status: updated.status as unknown as DomainAudioStatus,
    });
  }
}
