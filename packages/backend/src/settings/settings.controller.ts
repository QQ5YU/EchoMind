import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

const UpdateSettingsSchema = z.object({
  defaultLanguage: z.string(),
});
class UpdateSettingsDto extends createZodDto(UpdateSettingsSchema) {}

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('transcription')
  async getTranscription(@Request() req: RequestWithUser) {
    return this.settingsService.getTranscriptionSettings(req.user.userId);
  }

  @Put('transcription')
  async updateTranscription(@Request() req: RequestWithUser, @Body() body: UpdateSettingsDto) {
    return this.settingsService.updateTranscriptionSettings(req.user.userId, body.defaultLanguage);
  }
}
