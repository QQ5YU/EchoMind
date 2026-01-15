import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AudioModule } from './audio/audio.module';
import { FoldersModule } from './folders/folders.module';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    AudioModule,
    FoldersModule,
    SearchModule,
    SettingsModule,
  ],
  providers: [AppService],
})
export class ElectronAppModule {}
