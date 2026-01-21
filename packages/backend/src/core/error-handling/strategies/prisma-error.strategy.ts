import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorStrategy, ErrorContext } from './error.strategy';
import { Prisma } from '@prisma/client';
import { ApiErrorCode } from '@echomind/shared';

@Injectable()
export class PrismaErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    );
  }

  handle(error: any, _context?: ErrorContext) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let errorType = 'Internal Server Error';
    let errorCode: string = ApiErrorCode.DATABASE_ERROR;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'Input value too long for column';
          errorType = 'Bad Request';
          errorCode = ApiErrorCode.PRISMA_VALUE_TOO_LONG;
          break;
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint failed';
          errorType = 'Conflict';
          errorCode = ApiErrorCode.PRISMA_UNIQUE_CONSTRAINT_FAILED;
          break;
        case 'P2003':
          status = HttpStatus.CONFLICT;
          message = 'Foreign key constraint failed';
          errorType = 'Conflict';
          errorCode = ApiErrorCode.PRISMA_FOREIGN_KEY_FAILED;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          errorType = 'Not Found';
          errorCode = ApiErrorCode.PRISMA_RECORD_NOT_FOUND;
          break;
        default:
          message = `Database error: ${error.code}`;
          errorCode = ApiErrorCode.DATABASE_ERROR;
          break;
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = error.message;
      errorType = 'Bad Request';
      errorCode = ApiErrorCode.PRISMA_VALIDATION_ERROR;
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection failed';
      errorType = 'Service Unavailable';
      errorCode = ApiErrorCode.PRISMA_INITIALIZATION_ERROR;
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      message = 'Unknown database error';
      errorCode = ApiErrorCode.PRISMA_UNKNOWN_ERROR;
    }

    return {
      status,
      body: {
        statusCode: status,
        errorCode,
        message,
        error: errorType,
      },
    };
  }
}
