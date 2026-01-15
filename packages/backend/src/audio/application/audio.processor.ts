import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { AudioRepository } from '../domain/audio.repository';
import { TranscriptRepository } from '../../transcripts/domain/transcript.repository';
import { AudioStatus } from '@echomind/shared';
import * as path from 'path';
import * as fs from 'fs';
import { ErrorLoggerService } from '../../core/error-handling/error-logger.service';

@Processor('audio-transcription')
export class AudioProcessor {
  constructor(
    private readonly audioRepository: AudioRepository,
    private readonly transcriptRepository: TranscriptRepository,
    private readonly logger: ErrorLoggerService,
  ) {}

  @Process('transcribe')
  async handleTranscribe(job: Job<{ audioFileId: string; filePath: string }>) {
    const { audioFileId } = job.data;
    console.log(`Processing audio file ${audioFileId}...`);

    await this.audioRepository.updateStatus(
      audioFileId,
      AudioStatus.PROCESSING,
    );

    try {
      const scriptPath = path.resolve(
        __dirname,
        '../../../../../scripts/ai/process_audio.py',
      );

      if (!fs.existsSync(scriptPath)) {
        console.warn('AI script not found, using mock data.');
        await this.mockProcessing(audioFileId);
        await this.audioRepository.updateStatus(
          audioFileId,
          AudioStatus.PROCESSED,
        );
        return;
      }

      await this.mockProcessing(audioFileId);
      await this.audioRepository.updateStatus(
        audioFileId,
        AudioStatus.PROCESSED,
      );
    } catch (error) {
      this.logger.log(500, {
        method: 'BULL',
        path: `queue://audio-transcription/transcribe/${audioFileId}`,
        message: `Transcription failed: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      });
      await this.audioRepository.updateStatus(audioFileId, AudioStatus.ERROR);
    }
  }

  async mockProcessing(audioFileId: string) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTranscript = {
      language: 'en',
      segments: [
        {
          text: 'This is a mock transcript segment 1.',
          startTime: 0,
          endTime: 5,
        },
        {
          text: 'This is the second segment of the audio.',
          startTime: 5,
          endTime: 10,
        },
      ],
    };

    await this.transcriptRepository.save(
      { audioFileId, language: mockTranscript.language },
      mockTranscript.segments.map((s) => ({
        ...s,
        transcriptId: '',
      })),
    );
  }
}
