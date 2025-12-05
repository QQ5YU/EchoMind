# Research for MVP Audio Search

This document outlines the decisions made to resolve technical ambiguities in the initial implementation plan.

## 1. UI Component Library and Styling for React

-   **Decision**: We will use **PrimeReact for UI components and Tailwind CSS for styling and customization**.
-   **Rationale**: 
    -   Per the latest user request, both PrimeReact and Tailwind CSS will be used.
    -   **PrimeReact**: Offers a comprehensive suite of pre-built, robust, and themeable UI components, ensuring a consistent and professional user experience, aligning with **Constitution Principle III (Consistent User Experience)**.
    -   **Tailwind CSS**: Provides a utility-first framework for highly flexible and efficient styling, allowing for customization of PrimeReact components where needed, and rapid development of custom UI elements with granular control. This combination maximizes both consistency and design flexibility.
-   **Alternatives Considered**:
    -   **PrimeReact alone**: Limits styling flexibility and efficiency for custom elements.
    -   **Tailwind CSS alone**: Requires building all UI components from scratch, increasing development time.
    -   **Ant Design (AntD)/MUI (Material-UI) with custom CSS**: Offers less flexibility than Tailwind CSS for rapid, utility-first styling.

## 2. Technology Versions

-   **Decision**: We will use the current Long-Term Support (LTS) versions for our primary technologies.
    -   **Node.js**: Latest LTS version.
    -   **Python**: Latest stable version.
-   **Rationale**: Using LTS versions ensures stability, security updates, and a long support window, which is critical for a production application. This minimizes risks associated with newer, less-tested versions.
-   **Alternatives Considered**: Using the absolute latest versions was considered but rejected to prioritize stability over access to the newest features, in line with building a reliable MVP.

## 3. Testing Framework

-   **Decision**: 
    -   **Unit/Integration Tests**: **Vitest** and **React Testing Library** for the React (Renderer) code.
    -   **E2E Tests**: **Playwright** for end-to-end testing of the Electron application.
-   **Rationale**:
    -   Per user request, Vitest has been selected for unit/integration testing. Vitest offers a modern, fast testing experience with a Jest-compatible API, making it a seamless transition. It is designed to work well with Vite, which can be a consideration for future web-based versions of the application. React Testing Library will be used alongside it.
    -   Playwright remains the choice for E2E testing due to its robust support for Electron.
-   **Alternatives Considered**:
    -   **Jest**: The previous choice. A well-established and feature-rich testing framework.
    -   **Mocha/Chai**: Another valid alternative.

## 4. State Management and Data Fetching

-   **Decision**: 
    -   **Client State**: **Zustand** will be used for managing global client-side state.
    -   **Server State/Data Fetching**: **TanStack Query** (React Query) will be used to manage asynchronous data fetching, caching, and synchronization with the NestJS backend.
-   **Rationale**:
    -   **Zustand** is a lightweight, minimalistic state management library that is simple to use and requires very little boilerplate.
    -   **TanStack Query** is the industry standard for managing server state. It will handle all asynchronous API calls to the backend, simplifying data fetching logic in the UI and providing caching, re-fetching, and optimistic updates out of the box.
-   **Alternatives Considered**:
    -   **Redux Toolkit**: A very powerful state management library, but its complexity and boilerplate are overkill for the MVP's requirements.
    -   **React Context API**: Could be used for state, but Zustand provides a more optimized and scalable solution.

## 5. Database Toolkit and Validation

-   **Decision**: 
    -   **Database ORM**: **Prisma** will be used as the ORM to interact with the SQLite database from the NestJS backend.
    -   **Validation**: **Zod** will be used for schema validation for API inputs and data transfer objects (DTOs).
-   **Rationale**:
    -   **Prisma** provides a type-safe database client and declarative schema migrations, which significantly improves developer experience and reduces runtime errors.
    -   **Zod**, when used with NestJS pipes, provides seamless and type-safe validation for incoming requests.
-   **Alternatives Considered**:
    -   **TypeORM/Sequelize**: Other popular ORMs, but Prisma's modern approach and developer tooling are better suited.
    -   **Joi/Yup**: Alternatives for validation, but Zod's TypeScript-first approach is superior.

## 6. Frontend Architecture

-   **Decision**: We will adopt the **Feature-Sliced Design (FSD)** methodology for the React frontend architecture.
-   **Rationale**: 
    -   FSD is a well-structured architectural methodology that manages complexity by breaking down the application into layers and slices, enforcing a clear separation of concerns. This aligns with **Constitution Principle I (Clean Code Architecture)**.
-   **Alternatives Considered**:
    -   **Standard component/page structure**: Lacks the strict rules of FSD and can become disorganized.
    -   **Atomic Design**: More focused on UI component hierarchy than application architecture.

## 7. Backend Framework & Architecture

-   **Decision**:
    -   **Framework**: The backend will be a standalone **NestJS** application.
    -   **Architecture**: It will follow a **Domain-Driven Design (DDD)** approach. The "model layer" is defined by the Prisma schema and generated types, and integrates with Controller, Service, and Repository layers.
-   **Rationale**:
    -   The project follows a **client-server model** with a DDD structure.
    -   **DDD** provides a robust and scalable architecture by organizing code around business capabilities.
-   **Alternatives Considered**:
    -   **Standard NestJS structure**: Can lead to high coupling between domains.
    -   **Integrated Electron Backend**: The original approach, rejected by the user.

## 8. Caching and Job Queueing

-   **Decision**: We will use **Redis** for backend caching and to manage a job queue.
-   **Rationale**:
    -   A Redis-based queue (e.g., Bull) will be used for asynchronous AI job processing.
    -   Redis will be used for caching to reduce database load.
-   **Alternatives Considered**:
    -   **RabbitMQ/Kafka**: More complex than needed for the MVP.
    -   **In-memory cache**: Not persistent or scalable.

## 9. Package Manager

-   **Decision**: We will use **pnpm** as the package manager for the monorepo.
-   **Rationale**:
    -   pnpm is a fast, disk-space-efficient package manager with excellent workspace support.
-   **Alternatives Considered**:
    -   **npm/yarn**: pnpm is generally superior.

## 10. API Documentation

-   **Decision**: We will use **Swagger (OpenAPI)** for generating and serving API documentation.
-   **Rationale**:
    -   Swagger provides interactive, machine-readable documentation that can be auto-generated from code in NestJS.
-   **Alternatives Considered**:
    -   **Manual documentation**: Error-prone.
    -   **Postman collections**: Less integrated.
    
## 11. Authentication Strategy

-   **Decision**: We will implement a token-based authentication system using **JSON Web Tokens (JWT)**. The system will use a pair of tokens: a short-lived **access token** and a long-lived **refresh token**.
-   **Rationale**:
    -   **JWTs** are a stateless, industry-standard way to secure APIs.
    -   The **access token** will be sent with each API request to authorize the user. Its short lifespan minimizes the risk if it is compromised.
    -   The **refresh token** is stored securely (e.g., in an HttpOnly cookie or secure local storage) and used to obtain a new access token when the old one expires, providing a seamless user experience without requiring frequent logins.
    -   NestJS has robust support for this pattern using the `@nestjs/jwt` and `@nestjs/passport` packages.
-   **Alternatives Considered**:
    -   **Session-based authentication**: This is a stateful approach that requires server-side storage for session data, which adds complexity and does not scale as easily as a stateless JWT approach.
    -   **API Keys**: More suitable for machine-to-machine communication rather than user-based authentication.