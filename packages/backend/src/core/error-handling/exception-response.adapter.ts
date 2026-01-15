import { Injectable, Inject } from '@nestjs/common';
import { ApiErrorResponse } from '@echomind/shared';
import { ErrorStrategy, ERROR_STRATEGY } from './strategies/error.strategy';

@Injectable()
export class ExceptionResponseAdapter {
  constructor(
    @Inject(ERROR_STRATEGY) private readonly strategies: ErrorStrategy[],
  ) {}

  toApiResponse(
    exception: unknown,
    contextData: { path: string; method: string },
  ): { status: number; body: ApiErrorResponse } {
    const strategy = this.strategies.find((s) => s.canHandle(exception));

    if (!strategy) {
      throw new Error(
        `No error strategy found for exception: ${exception instanceof Error ? exception.constructor.name : typeof exception}. Ensure DefaultErrorStrategy is registered.`,
      );
    }

    const { status, body } = strategy.handle(exception, contextData);

    return {
      status,
      body: {
        ...body,
        timestamp: new Date().toISOString(),
        path: contextData.path,
        method: contextData.method,
      },
    };
  }
}
