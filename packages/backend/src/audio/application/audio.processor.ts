import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subject, from, of } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';
import { AudioRepository } from '../domain/audio.repository';
import { TranscriptService } from '../../transcripts/application/transcript.service';
import { AudioStatus } from '@echomind/shared';
import { AiProcessService } from '../../ai/ai.process.service';
import { TranscribeJob } from '../domain/audio.types';
import { EventsGateway } from '../../core/events/events.gateway';

@Injectable()
export class AudioProcessor implements OnModuleInit {
  private readonly logger = new Logger(AudioProcessor.name);
  private readonly jobQueue = new Subject<TranscribeJob>();

  constructor(
    private readonly audioRepository: AudioRepository,
    private readonly transcriptService: TranscriptService,
    private readonly aiProcessService: AiProcessService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  onModuleInit() {
    this.initializeQueueWorker();
  }

  async addTranscribeJob(audioFileId: string, filePath: string): Promise<void> {
    this.logger.log(`Queueing transcription job for file: ${audioFileId}`);

    await this.audioRepository.updateStatus(audioFileId, AudioStatus.PENDING);
    this.jobQueue.next({ audioFileId, filePath });
  }

  private initializeQueueWorker() {
    this.jobQueue
      .pipe(
        mergeMap(
          (job) =>
            from(this.processJob(job)).pipe(
              retry(2),
              catchError((error) => {
                this.logger.error(
                  `Unhandled error in queue processing for ${job.audioFileId}`,
                  error,
                );
                return of(null);
              }),
            ),
          2,
        ),
      )
      .subscribe();
  }

  private async processJob(job: TranscribeJob): Promise<void> {
    const { audioFileId, filePath } = job;
    this.logger.log(`Processing audio file: ${audioFileId}`);

    try {
      await this.audioRepository.updateStatus(
        audioFileId,
        AudioStatus.PROCESSING,
      );

      this.eventsGateway.broadcast('audio.updated', {
        id: audioFileId,
        status: AudioStatus.PROCESSING,
      });

      const result = await this.aiProcessService.transcribe(
        filePath,
        audioFileId,
      );

      await this.transcriptService.createFromAiResult({
        audioFileId,
        language: result.language || 'unknown',
        segments: result.segments || [],
      });

      await this.audioRepository.updateStatus(
        audioFileId,
        AudioStatus.PROCESSED,
      );

      this.eventsGateway.broadcast('audio.updated', {
        id: audioFileId,
        status: AudioStatus.PROCESSED,
      });

      this.logger.log(`Successfully processed audio file: ${audioFileId}`);
    } catch (error) {
      this.logger.error(
        `Failed to process audio file ${audioFileId}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      await this.audioRepository.updateStatus(audioFileId, AudioStatus.ERROR);

      this.eventsGateway.broadcast('audio.updated', {
        id: audioFileId,
        status: AudioStatus.ERROR,
      });
    }
  }
}
