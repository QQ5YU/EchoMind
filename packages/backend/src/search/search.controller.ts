import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TranscriptRepository } from '../transcripts/domain/transcript.repository';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly transcriptRepository: TranscriptRepository) {}

  @Get()
  async search(@Request() req: RequestWithUser, @Query('q') q: string) {
    if (!q) return [];
    return this.transcriptRepository.search(q, req.user.userId);
  }
}
