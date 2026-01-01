import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ZodValidationException } from 'nestjs-zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      responseBody.message = typeof response === 'string' ? response : (response as any).message || response;
      responseBody.error = typeof response === 'string' ? undefined : (response as any).error;
    } else if (exception instanceof ZodValidationException) {
      httpStatus = HttpStatus.BAD_wu_REQUEST; // 400
      responseBody.message = 'Validation failed';
      responseBody.errors = exception.getValidationIssues();
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma Errors
      if (exception.code === 'P2002') {
        httpStatus = HttpStatus.CONFLICT;
        responseBody.message = 'Unique constraint failed';
      } else {
        // Log unknown prisma errors
        console.error('Prisma Error Code:', exception.code);
      }
    }

    responseBody.statusCode = httpStatus;

    // Log the error
    if (httpStatus >= 500) {
      this.logger.error(
        `Http Status: ${httpStatus} Error Message: ${JSON.stringify(responseBody)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `Http Status: ${httpStatus} Error Message: ${JSON.stringify(responseBody)}`,
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
