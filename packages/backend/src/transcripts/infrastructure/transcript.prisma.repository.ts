import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma';
import { Transcript, TranscriptSegment } from '../domain/transcript.entity';
import {
  TranscriptRepository,
  SearchResult,
} from '../domain/transcript.repository';

@Injectable()
export class TranscriptPrismaRepository implements TranscriptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByAudioFileId(audioFileId: string): Promise<Transcript | null> {
    const t = await this.prisma.transcript.findUnique({
      where: { audioFileId },
      include: { segments: { orderBy: { startTime: 'asc' } } },
    });
    if (!t) return null;
    return new Transcript({
      ...t,
      segments: t.segments.map((s) => new TranscriptSegment(s)),
    });
  }

  async save(
    transcriptData: Omit<Transcript, 'id' | 'segments'>,
    segmentsData: Omit<TranscriptSegment, 'id' | 'transcriptId'>[],
  ): Promise<Transcript> {
    const result = await this.prisma.transcript.create({
      data: {
        audioFileId: transcriptData.audioFileId,
        language: transcriptData.language,
        segments: {
          create: segmentsData.map((s) => ({
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
      },
      include: { segments: true },
    });

    return new Transcript({
      ...result,
      segments: result.segments.map((s) => new TranscriptSegment(s)),
    });
  }

  async search(query: string, userId: string): Promise<SearchResult[]> {
    const segments = await this.prisma.transcriptSegment.findMany({
      where: {
        text: { contains: query },
        transcript: {
          audioFile: {
            userId: userId,
          },
        },
      },
      include: {
        transcript: {
          include: {
            audioFile: true,
          },
        },
      },
      take: 20,
    });

    return segments.map((s) => ({
      segmentId: s.id,
      text: s.text,
      startTime: s.startTime,
      endTime: s.endTime,
      audioFile: {
        id: s.transcript.audioFile.id,
        fileName: s.transcript.audioFile.fileName,
      },
    }));
  }
}
