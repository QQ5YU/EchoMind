import { Injectable } from '@nestjs/common';
import { ErrorStrategy, ErrorContext } from './error.strategy';
import { DomainException } from '../exceptions/domain.exception';

@Injectable()
export class DomainErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown): boolean {
    return error instanceof DomainException;
  }

  handle(error: DomainException, _context?: ErrorContext) {
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
