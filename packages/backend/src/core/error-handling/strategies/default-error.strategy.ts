import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@echomind/shared';
import { ErrorStrategy, ErrorContext } from './error.strategy';

@Injectable()
export class DefaultErrorStrategy implements ErrorStrategy {
  canHandle(_error: unknown): boolean {
    return true;
  }

  handle(_error: unknown, _context?: ErrorContext) {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ApiErrorCode.UNHANDLED_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    };
  }
}
