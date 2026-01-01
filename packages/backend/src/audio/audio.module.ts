import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService } from './application/audio.service';
import { AudioRepository } from './domain/audio.repository';
import { AudioPrismaRepository } from './infrastructure/audio.prisma.repository';
import { BullModule } from '@nestjs/bull';
import { AudioProcessor } from './application/audio.processor';
import { TranscriptsModule } from '../transcripts/transcripts.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-transcription',
    }),
    TranscriptsModule,
  ],
  controllers: [AudioController],
  providers: [
    AudioService,
    AudioProcessor,
    {
      provide: AudioRepository,
      useClass: AudioPrismaRepository,
    },
  ],
})
export class AudioModule {}
