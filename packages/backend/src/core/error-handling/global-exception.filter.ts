import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponseAdapter } from './exception-response.adapter';
import { ErrorLoggerService } from './error-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly adapter: ExceptionResponseAdapter,
    private readonly loggerService: ErrorLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.adapter.toApiResponse(exception, {
      path: request.url,
      method: request.method,
    });

    this.loggerService.log(status, {
      method: request.method,
      path: request.url,
      message: body.message,
      stack: exception instanceof Error ? exception.stack : String(exception),
    });

    response.status(status).json(body);
  }
}
