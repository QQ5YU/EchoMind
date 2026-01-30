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

## 8. Caching

-   **Decision**: We will use **Redis** for backend caching if needed.
-   **Rationale**: Redis can be used for general-purpose caching to reduce database load. Asynchronous AI job processing will be handled via direct Inter-Process Communication (IPC) with the AI sidecar service, removing the need for a separate job queue like Bull.
-   **Alternatives Considered**:
    -   **RabbitMQ/Kafka**: Overkill for this project.
    -   **In-memory cache**: Not persistent or scalable if caching needs grow.

## 9. Package Manager

-   **Decision**: We will use **pnpm** as the package manager for the monorepo.
-   **Rationale**:
    -   pnpm is a fast, disk-space-efficient package manager with excellent workspace support.
-   **Alternatives Considered**:
    -   **npm/yarn**: pnpm is generally superior.

## 10. API Documentation

-   **Decision**: We will use **Swagger (OpenAPI)** for generating and serving API documentation for the NestJS backend's REST API (for client-backend communication).
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

## 12. AI Service Architecture

-   **Decision**: 
    -   The `packages/ai-service` will be developed as a separate, long-running service (**Sidecar pattern**).
    -   The NestJS backend will communicate with it via a direct **Inter-Process Communication (IPC)** channel, sending and receiving newline-delimited JSON messages over `stdin`/`stdout`.
    -   **ChromaDB** will be used as the vector database for storing and querying embeddings.
    -   **`faster-whisper`** will be used for speech-to-text transcription.
    -   **`gte-small`** or **`BGE-M3-small`** will be used for generating vector embeddings from transcript segments.
-   **Rationale**:
    -   A **Sidecar** architecture decouples the AI processing from the main backend, allowing them to be developed, deployed, and scaled independently. This aligns with **Constitution Principle IV (Performance by Design)**.
    -   A direct **IPC channel** provides the lowest-latency communication and simplifies the architecture by removing the need for an HTTP server in the AI service, which is ideal for a tightly-coupled desktop application environment.
    -   **ChromaDB** is a specialized vector database designed for similarity search, making it a perfect fit for the semantic search feature.
    -   `gte-small` and `BGE-M3-small` are efficient and high-performing embedding models suitable for this use case.
-   **Workflow**:
    1.  The NestJS backend receives an audio file, saves it, and updates the `AudioFile` status to `PROCESSING`.
    2.  The backend sends a `transcribe` request message to the `ai-service` via its `stdin`.
    3.  The `ai-service` receives the message, uses `faster-whisper` to transcribe the audio, and generates embeddings for each segment.
    4.  The `ai-service` calls the NestJS backend API to save the transcript segments to the SQLite database.
    5.  The `ai-service` saves the embeddings and corresponding segment IDs to **ChromaDB**.
    6.  Upon completion, the `ai-service` sends a `transcribe_response` message to the backend via `stdout`.
    7.  The backend receives the response and updates the `AudioFile` status to `PROCESSED` or `ERROR`.
-   **Search Workflow**:
    1.  A user initiates a search from the client.
    2.  The NestJS backend receives the search query.
    3.  The backend sends a `search` request message to the `ai-service` via `stdin`.
    4.  The `ai-service` generates an embedding for the query, searches ChromaDB, and gets a list of matching segment IDs.
    5.  The `ai-service` sends a `search_response` message with the IDs back to the backend via `stdout`.
    6.  The backend fetches the full segment details from the SQLite database and returns them to the client.

## 13. Overall Application Architecture

-   **Decision**: We will adopt a **hybrid client-server model** that supports both convenient web-based development and a self-contained production Electron application.
-   **Rationale**: This approach provides the best of both worlds: a clean separation of concerns and a fast development loop using standard web tools, while delivering a seamless, "it-just-works" experience for the end-user of the desktop application. It also keeps the architecture flexible for a potential web-based client in the future.
-   **Operating Modes**:
    1.  **Development Mode**: The `backend` (NestJS) and `ai-service` (Python) are run as independent processes. The React UI is served in a standard web browser and communicates with the services over HTTP, allowing for hot-reloading and rapid development.
    2.  **Production (Electron) Mode**: The final Electron application will package the `backend` and `ai-service` builds. Upon application startup, the Electron main process will be responsible for spawning and managing these services as background child processes. The React UI, running in the Electron renderer process, communicates with the `backend` via standard HTTP requests to `localhost`. The `backend` then communicates with the `ai-service` via IPC.
-   **Implementation Strategy**: The frontend does not require a complex adapter. It will always communicate with the backend via HTTP. In development, this will be to a port on `localhost`. In production, the Electron main process will ensure the backend is running on a known local port that the UI can call.