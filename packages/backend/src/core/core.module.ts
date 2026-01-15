import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ExceptionResponseAdapter } from './error-handling/exception-response.adapter';
import { GlobalExceptionFilter } from './error-handling/global-exception.filter';
import { ErrorLoggerService } from './error-handling/error-logger.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ERROR_STRATEGY,
  NestHttpErrorStrategy,
  ApplicationErrorStrategy,
  DomainErrorStrategy,
  PrismaErrorStrategy,
  ZodErrorStrategy,
  DefaultErrorStrategy,
} from './error-handling/strategies';

@Global()
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    ExceptionResponseAdapter,
    ErrorLoggerService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: ERROR_STRATEGY,
      useFactory: (
        nestHttpStrategy: NestHttpErrorStrategy,
        appStrategy: ApplicationErrorStrategy,
        domainStrategy: DomainErrorStrategy,
        prismaStrategy: PrismaErrorStrategy,
        zodStrategy: ZodErrorStrategy,
        defaultStrategy: DefaultErrorStrategy,
      ) => [
        zodStrategy,
        nestHttpStrategy,
        appStrategy,
        domainStrategy,
        prismaStrategy,
        defaultStrategy,
      ],
      inject: [
        NestHttpErrorStrategy,
        ApplicationErrorStrategy,
        DomainErrorStrategy,
        PrismaErrorStrategy,
        ZodErrorStrategy,
        DefaultErrorStrategy,
      ],
    },
    NestHttpErrorStrategy,
    ApplicationErrorStrategy,
    DomainErrorStrategy,
    PrismaErrorStrategy,
    ZodErrorStrategy,
    DefaultErrorStrategy,
  ],
  exports: [ExceptionResponseAdapter, ErrorLoggerService],
})
export class CoreModule {}
