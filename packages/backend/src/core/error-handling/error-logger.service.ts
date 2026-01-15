import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorLogContext } from './types/error-log.interface';

@Injectable()
export class ErrorLoggerService {
  private readonly logger = new Logger('AppError');
  private readonly shouldLogWarn: boolean;

  constructor(private readonly configService: ConfigService) {
    this.shouldLogWarn =
      this.configService.get<string>('LOG_WARN_ERRORS') !== 'false';
  }

  log(status: number, context: ErrorLogContext) {
    const logMessage = `[${context.method}] ${context.path} - ${status} - ${context.message}`;

    if (status >= 500) {
      this.logger.error(logMessage, context.stack);
    } else if (status === 401 || status === 403 || status === 409) {
      if (this.shouldLogWarn) {
        this.logger.warn(logMessage);
      }
    } else {
      // For 400, 404, etc., use standard log level to avoid noise in warn logs
      this.logger.log(logMessage);
    }
  }
}
