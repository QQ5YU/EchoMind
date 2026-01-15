# Error Handling Reference

This document lists the exceptions handled by the unified backend error handler, along with their corresponding HTTP status codes, `ApiErrorCode` enums, and response messages.

## Application Exceptions
Handled by `ApplicationErrorStrategy`.

| Exception Class | HTTP Status | Error Code Enum | Default Message |
| :--- | :--- | :--- | :--- |
| `EntityNotFoundException` | 404 Not Found | `ENTITY_NOT_FOUND` | `"{EntityName} with identifier "{identifier}" was not found."` |
| `DuplicateEntityException` | 409 Conflict | `DUPLICATE_ENTITY` | `"{EntityName} with this {field} already exists."` |
| `InsufficientPermissionException` | 403 Forbidden | `INSUFFICIENT_PERMISSION` | `"You do not have permission to perform this action."` |

## Domain Exceptions
Handled by `DomainErrorStrategy`.

| Exception Class | HTTP Status | Error Code Enum | Default Message |
| :--- | :--- | :--- | :--- |
| `BusinessRuleValidationException` | 400 Bad Request | `BUSINESS_RULE_VALIDATION_FAILED` | *(Dynamic message provided when thrown)* |

## Prisma (Database) Exceptions
Handled by `PrismaErrorStrategy`.

| Prisma Error Code / Type | HTTP Status | Error Code Enum | Message |
| :--- | :--- | :--- | :--- |
| `P2000` | 400 Bad Request | `PRISMA_VALUE_TOO_LONG` | `"Input value too long for column"` |
| `P2002` | 409 Conflict | `PRISMA_UNIQUE_CONSTRAINT_FAILED` | `"Unique constraint failed"` |
| `P2003` | 409 Conflict | `PRISMA_FOREIGN_KEY_FAILED` | `"Foreign key constraint failed"` |
| `P2025` | 404 Not Found | `PRISMA_RECORD_NOT_FOUND` | `"Record not found"` |
| Other `PrismaClientKnownRequestError` | 500 Internal Server Error | `DATABASE_ERROR` | `"Database error: {code}"` |
| `PrismaClientValidationError` | 400 Bad Request | `PRISMA_VALIDATION_ERROR` | `"Invalid database query"` |
| `PrismaClientInitializationError` | 503 Service Unavailable | `PRISMA_INITIALIZATION_ERROR` | `"Database connection failed"` |
| `PrismaClientUnknownRequestError` | 500 Internal Server Error | `PRISMA_UNKNOWN_ERROR` | `"Unknown database error"` |

## Validation Exceptions
Handled by `ZodErrorStrategy`.

| Exception Class | HTTP Status | Error Code Enum | Message |
| :--- | :--- | :--- | :--- |
| `ZodError` / `ZodValidationException` | 400 Bad Request | `VALIDATION_FAILED` | `"Validation failed"` (Details in `details` field) |

## NestJS HTTP Exceptions
Handled by `NestHttpErrorStrategy`.
Standard NestJS `HttpException`s are mapped to specific error codes based on their status.

| HTTP Status | Error Code Enum |
| :--- | :--- |
| 404 Not Found | `ENTITY_NOT_FOUND` |
| 401 Unauthorized | `INSUFFICIENT_PERMISSION` |
| 403 Forbidden | `INSUFFICIENT_PERMISSION` |
| 409 Conflict | `DUPLICATE_ENTITY` |
| 400 Bad Request | `VALIDATION_FAILED` |
| 413 Payload Too Large | `VALIDATION_FAILED` |
| 415 Unsupported Media Type | `VALIDATION_FAILED` |
| 500 Internal Server Error | `INTERNAL_SERVER_ERROR` |
| *(Others)* | `NEST_HTTP_ERROR` |

## Default / Unhandled Exceptions
Handled by `DefaultErrorStrategy`.

| Exception | HTTP Status | Error Code Enum | Message |
| :--- | :--- | :--- | :--- |
| `unknown` | 500 Internal Server Error | `UNHANDLED_ERROR` | `"Internal server error"` |
