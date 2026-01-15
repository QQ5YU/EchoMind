import { HttpStatus } from '@nestjs/common';
import { ApiErrorCode } from '@echomind/shared';

export abstract class ApplicationException extends Error {
  abstract readonly errorCode: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EntityNotFoundException extends ApplicationException {
  readonly errorCode = ApiErrorCode.ENTITY_NOT_FOUND;
  readonly statusCode = HttpStatus.NOT_FOUND;

  constructor(entityName: string, identifier?: string | number) {
    super(
      `${entityName}${identifier ? ` with identifier "${identifier}"` : ''} was not found.`,
    );
  }
}

export class DuplicateEntityException extends ApplicationException {
  readonly errorCode = ApiErrorCode.DUPLICATE_ENTITY;
  readonly statusCode = HttpStatus.CONFLICT;

  constructor(entityName: string, field: string) {
    super(`${entityName} with this ${field} already exists.`);
  }
}

export class InsufficientPermissionException extends ApplicationException {
  readonly errorCode = ApiErrorCode.INSUFFICIENT_PERMISSION;
  readonly statusCode = HttpStatus.FORBIDDEN;

  constructor(message = 'You do not have permission to perform this action.') {
    super(message);
  }
}

export class FileOperationException extends ApplicationException {
  readonly errorCode = ApiErrorCode.INTERNAL_SERVER_ERROR;
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}
