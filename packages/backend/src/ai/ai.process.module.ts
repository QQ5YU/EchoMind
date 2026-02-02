import { Module } from '@nestjs/common';
import { AiProcessService } from './ai.process.service';

@Module({
  providers: [AiProcessService],
  exports: [AiProcessService],
})
export class AiProcessModule {}
