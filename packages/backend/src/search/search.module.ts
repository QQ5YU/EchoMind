import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { TranscriptsModule } from '../transcripts/transcripts.module';

@Module({
  imports: [TranscriptsModule],
  controllers: [SearchController],
})
export class SearchModule {}
