import { HttpStatus, Injectable } from '@nestjs/common';
import { ZodError, ZodIssue } from 'zod';
import { ZodValidationException } from 'nestjs-zod';
import { ApiErrorCode } from '@echomind/shared';
import { ErrorStrategy, ErrorContext } from './error.strategy';

@Injectable()
export class ZodErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown): boolean {
    return error instanceof ZodError || error instanceof ZodValidationException;
  }

  handle(error: ZodError | ZodValidationException, _context?: ErrorContext) {
    let issues: ZodIssue[] = [];

    if (error instanceof ZodValidationException) {
      const zodError = error.getZodError();
      if (zodError instanceof ZodError) {
        issues = zodError.errors;
      } else {
        const response = error.getResponse();
        if (
          typeof response === 'object' &&
          response !== null &&
          'errors' in response &&
          Array.isArray((response as any).errors)
        ) {
          issues = (response as any).errors as ZodIssue[];
        }
      }
    } else {
      issues = error.errors;
    }

    const formattedErrors = this.formatErrors(issues);

    return {
      status: HttpStatus.BAD_REQUEST,
      body: {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ApiErrorCode.VALIDATION_FAILED,
        message: 'Validation failed',
        error: 'Bad Request',
        details: formattedErrors,
      },
    };
  }

  private formatErrors(issues: ZodIssue[]): Record<string, string> {
    return issues.reduce<Record<string, string>>((acc, issue) => {
      const path = issue.path.join('.');
      acc[path] = issue.message;
      return acc;
    }, {});
  }
}
