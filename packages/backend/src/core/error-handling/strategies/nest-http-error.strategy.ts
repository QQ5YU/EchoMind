import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiErrorCode } from '@echomind/shared';
import { ErrorStrategy, ErrorContext } from './error.strategy';

@Injectable()
export class NestHttpErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown): boolean {
    return error instanceof HttpException;
  }

  handle(error: HttpException, _context?: ErrorContext) {
    const status = error.getStatus();
    const res = error.getResponse();

    let message: string;
    let errorType: string;

    if (typeof res === 'object' && res !== null) {
      const body = res as any;
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message || error.message;
      errorType = body.error || HttpStatus[status] || 'Error';
    } else {
      message = error.message;
      errorType = HttpStatus[status] || 'Error';
    }

    const errorCode = this.mapStatusToErrorCode(status);

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

  private mapStatusToErrorCode(status: number): ApiErrorCode {
    switch (status) {
      case HttpStatus.NOT_FOUND:
        return ApiErrorCode.ENTITY_NOT_FOUND;
      case HttpStatus.UNAUTHORIZED:
      case HttpStatus.FORBIDDEN:
        return ApiErrorCode.INSUFFICIENT_PERMISSION;
      case HttpStatus.CONFLICT:
        return ApiErrorCode.DUPLICATE_ENTITY;
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.PAYLOAD_TOO_LARGE:
      case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
        return ApiErrorCode.VALIDATION_FAILED;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ApiErrorCode.INTERNAL_SERVER_ERROR;
      default:
        return ApiErrorCode.NEST_HTTP_ERROR;
    }
  }
}
