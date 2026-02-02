import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@core';
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
      validationSchema: Joi.object({
        API_BASE_URL: Joi.string().uri().default('http://localhost:3000'),
      }),
    }),
    CoreModule,
    PrismaModule,
    AuthModule,
    UserModule,
    AudioModule,
    FoldersModule,
    SearchModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
