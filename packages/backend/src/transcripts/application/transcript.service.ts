import { Injectable } from '@nestjs/common';
import { TranscriptRepository } from '../domain/transcript.repository';
import { TranscriptDto, CreateTranscriptDto } from '@echomind/shared';

@Injectable()
export class TranscriptService {
  constructor(private readonly transcriptRepository: TranscriptRepository) {}

  async getTranscriptByAudioId(
    audioFileId: string,
  ): Promise<TranscriptDto | null> {
    const transcript = await this.transcriptRepository.findByAudioFileId(audioFileId);
    if (!transcript) return null;

    const dto: TranscriptDto = {
      id: transcript.id,
      audioFileId: transcript.audioFileId,
      language: transcript.language,
      segments: transcript.segments.map((s) => ({
        text: s.text,
        start: s.startTime,
        end: s.endTime,
      })),
    } as unknown as TranscriptDto;

    return dto;
  }

  async createFromAiResult(dto: CreateTranscriptDto): Promise<void> {
    const { audioFileId, language, segments } = dto;

    const domainSegments = segments.map((seg) => ({
      text: seg.text,
      startTime: seg.start,
      endTime: seg.end,
      transcriptId: '',
    }));

    await this.transcriptRepository.save(
      {
        audioFileId,
        language: language || 'unknown',
      },
      domainSegments,
    );
  }
}
