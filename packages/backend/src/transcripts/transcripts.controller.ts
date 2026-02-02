import { Controller, Get, Param } from '@nestjs/common';
import { TranscriptService } from './application/transcript.service';
import { TranscriptDto } from '@echomind/shared';

@Controller('transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Get(':audioId')
  async getTranscript(
    @Param('audioId') audioId: string,
  ): Promise<TranscriptDto | null> {
    return this.transcriptService.getTranscriptByAudioId(audioId);
  }
}
