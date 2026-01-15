# Unified Backend Error Handling Architecture

## Overview

This document describes the error handling architecture for the EchoMind backend. The system is designed based on **Clean Architecture** principles, ensuring separation of concerns, testability, and consistency across different transport layers (HTTP and Electron IPC).

## Core Philosophy

1.  **Transport Agnostic**: Business logic (Services) should not depend on transport details (like HTTP status codes). They should throw pure **Domain** or **Application** exceptions.
2.  **Single Source of Truth**: The logic for mapping exceptions to response objects is centralized in one Adapter, ensuring both HTTP and IPC clients receive identical error formats.
3.  **Open/Closed Principle**: New error types can be handled by adding new Strategies without modifying existing code.

## Architecture

```mermaid
graph TD
    subgraph "Application Layer"
        Service[Service / Use Case]
        Service -- throws --> DomainEx[DomainException]
        Service -- throws --> AppEx[ApplicationException]
    end

    subgraph "Interface Layer"
        Pipe[ZodValidationPipe (DI)]
        HTTP[GlobalExceptionFilter (HTTP)]
        IPC[IpcHandler (Electron)]
    end

    subgraph "Core Error Handling"
        Adapter[ExceptionResponseAdapter]
        Logger[ErrorLoggerService]
        Strategy[Error Strategies]
    end

    Pipe -- catches validation error --> Adapter
    HTTP -- catches unhandled --> Adapter
    IPC -- catches unhandled --> Adapter
    Adapter -- delegates to --> Strategy
    
    HTTP -- calls --> Logger
    IPC -- calls --> Logger
```

## Component Breakdown

### 1. Exceptions (The "What")
Located in: `packages/backend/src/core/exceptions/`

*   **`DomainException`**: Base class for pure business rule violations (e.g., "Password too weak"). Maps to 400.
*   **`ApplicationException`**: Base class for operation flow errors.
    *   `EntityNotFoundException`: Resource missing (Maps to 404).
    *   `DuplicateEntityException`: Conflict (Maps to 409).
    *   `InsufficientPermissionException`: Forbidden (Maps to 403).
*   **`ZodError`**: Automatic validation errors thrown by the pipe.

### 2. Validation Integration (The "Filter")
Instead of manually binding pipes in `main.ts`, we use NestJS Dependency Injection in `CoreModule`. This allows the validation flow to be fully integrated with our custom error strategies.

```typescript
// packages/backend/src/core/core.module.ts
{
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
}
```

### 3. Strategies (The "How")
Located in: `packages/backend/src/core/filters/strategies/`

Each strategy is responsible for handling a specific type of error and converting it into a standardized format.

*   **`ZodErrorStrategy`**: Specifically handles validation errors from the `ZodValidationPipe`, formatting them into a clear `details` object for the client.
*   **`PrismaErrorStrategy`**: Handles DB errors (P2002, P2025...).
*   **`DomainErrorStrategy` & `ApplicationErrorStrategy`**: Handle custom exceptions.
*   **`NestHttpErrorStrategy`**: Wraps standard NestJS exceptions to match our unified format.

### 3. Adapter (The "Dispatcher")
Located in: `packages/backend/src/core/filters/exception-response.adapter.ts`

A NestJS provider that holds the list of strategies. It receives an unknown error and delegates it to the correct strategy.
*   **Input**: `unknown` error.
*   **Output**: Standardized `ApiErrorResponse` object + Status Code.

### 4. Logger (The "Recorder")
Located in: `packages/backend/src/core/utils/error-logger.service.ts`

A centralized service for logging errors.
*   **Configurable**: Can suppress 4xx logs via `LOG_WARN_ERRORS` env var.
*   **Consistent**: Ensures standardized log format `[METHOD] /path - Status - Message`.

## Usage Guide for Developers

### How to throw an error in a Service?

Do **NOT** throw NestJS `HttpException` (e.g., `NotFoundException`).
Instead, throw a custom exception:

```typescript
import { EntityNotFoundException } from '@/core/exceptions/application.exceptions';

async function getUser(id: string) {
  const user = await db.find(id);
  if (!user) {
    // Correct ✅
    throw new EntityNotFoundException('User', id);
    
    // Incorrect ❌ (Couples service to HTTP)
    // throw new NotFoundException();
  }
}
```

### How to add a new Error Type?

1.  Create a new exception class (if needed).
2.  Create a new Strategy implementing `ErrorStrategy`.
3.  Add the strategy to the `strategies` array in `ExceptionResponseAdapter`.

```typescript
// Example: Adding support for Stripe errors
export class StripeErrorStrategy implements ErrorStrategy {
  canHandle(error: unknown) { return error instanceof StripeError; }
  handle(error: StripeError) { ... }
}
```

## Integration Points

*   **HTTP**: Wired via `GlobalExceptionFilter` (provided globally in `CoreModule`).
*   **IPC**: Wired manually in `desktop-client/src/main/ipc/handler.ts` using `nestApp.get()`.
