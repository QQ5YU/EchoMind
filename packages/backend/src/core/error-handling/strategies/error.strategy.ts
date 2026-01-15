import { ApiErrorResponse } from '@echomind/shared';

export const ERROR_STRATEGY = 'ERROR_STRATEGY';

export interface ErrorContext {
  path: string;
  method: string;
}

export interface ErrorStrategy {
  canHandle(error: unknown): boolean;
  handle(
    error: unknown,
    context?: ErrorContext,
  ): {
    status: number;
    body: Omit<ApiErrorResponse, 'timestamp' | 'path' | 'method'>;
  };
}