import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService, AudioProcessor } from './application';
import { AudioRepository } from './domain';
import { AudioPrismaRepository } from './infrastructure/audio.prisma.repository';
import { TranscriptsModule } from '@transcripts';
import { AiProcessModule } from '@ai/ai.process.module';
import { EventsModule } from '@core/events';

@Module({
  imports: [TranscriptsModule, AiProcessModule, EventsModule],
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
