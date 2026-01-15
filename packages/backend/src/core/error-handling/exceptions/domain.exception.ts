import { HttpStatus } from '@nestjs/common';
import { ApiErrorCode } from '@echomind/shared';

export abstract class DomainException extends Error {
  abstract readonly errorCode: string;
  readonly statusCode: number = HttpStatus.BAD_REQUEST;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BusinessRuleValidationException extends DomainException {
  readonly errorCode = ApiErrorCode.BUSINESS_RULE_VALIDATION_FAILED;

  constructor(message: string) {
    super(message);
  }
}
