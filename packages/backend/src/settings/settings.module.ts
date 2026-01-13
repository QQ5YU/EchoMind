import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './application/settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
