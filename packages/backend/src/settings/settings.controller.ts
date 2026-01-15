import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './application/settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';
import { UpdateSettingsDto } from './dto/settings.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('transcription')
  async getTranscription(@Request() req: RequestWithUser) {
    return this.settingsService.getTranscriptionSettings(req.user.userId);
  }

  @Put('transcription')
  async updateTranscription(
    @Request() req: RequestWithUser,
    @Body() body: UpdateSettingsDto,
  ) {
    return this.settingsService.updateTranscriptionSettings(
      req.user.userId,
      body.defaultLanguage!,
    );
  }
}
