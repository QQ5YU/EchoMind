import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaModule } from '@core/prisma';
import { AuthModule } from '@auth';
import { UserModule } from '@user';
import { AudioModule } from '@audio';
import { FoldersModule } from '@folders';
import { SearchModule } from '@search';
import { SettingsModule } from '@settings';

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
