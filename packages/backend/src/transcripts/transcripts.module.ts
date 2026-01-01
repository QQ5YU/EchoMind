import { Module } from '@nestjs/common';
import { TranscriptRepository } from './domain/transcript.repository';
import { TranscriptPrismaRepository } from './infrastructure/transcript.prisma.repository';

@Module({
  providers: [
    {
      provide: TranscriptRepository,
      useClass: TranscriptPrismaRepository,
    },
  ],
  exports: [TranscriptRepository],
})
export class TranscriptsModule {}
