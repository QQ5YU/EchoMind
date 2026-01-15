import { Injectable } from '@nestjs/common';
import { ErrorStrategy, ErrorContext } from './error.strategy';
import { ApplicationException } from '../exceptions/application.exception';

@Injectable()
export class ApplicationErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown): boolean {
    return error instanceof ApplicationException;
  }

  handle(error: ApplicationException, _context?: ErrorContext) {
    return {
      status: error.statusCode,
      body: {
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        message: error.message,
        error: error.name,
      },
    };
  }
}
