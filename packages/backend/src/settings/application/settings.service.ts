import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTranscriptionSettings(userId: string) {
    const setting = await this.prisma.userSetting.findFirst({
      where: { userId, key: 'defaultLanguage' },
    });
    return { defaultLanguage: setting?.value || 'English' };
  }

  async updateTranscriptionSettings(userId: string, defaultLanguage: string) {
    const existing = await this.prisma.userSetting.findFirst({
      where: { userId, key: 'defaultLanguage' },
    });

    if (existing) {
      await this.prisma.userSetting.update({
        where: { id: existing.id },
        data: { value: defaultLanguage },
      });
    } else {
      await this.prisma.userSetting.create({
        data: {
          userId,
          key: 'defaultLanguage',
          value: defaultLanguage,
        },
      });
    }
    return { status: 'ok' };
  }
}
