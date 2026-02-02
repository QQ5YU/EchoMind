import { Module } from '@nestjs/common';
import { TranscriptRepository } from './domain/transcript.repository';
import { TranscriptPrismaRepository } from './infrastructure/transcript.prisma.repository';
import { TranscriptService } from './application/transcript.service';
import { TranscriptsController } from './transcripts.controller';

@Module({
  controllers: [TranscriptsController],
  providers: [
    {
      provide: TranscriptRepository,
      useClass: TranscriptPrismaRepository,
    },
    TranscriptService,
  ],
  exports: [TranscriptRepository, TranscriptService],
})
export class TranscriptsModule {}
