# Frontend Architecture: EchoMind Desktop Client

This document outlines the architecture of the EchoMind desktop client, which is built using Electron and React. The architecture is designed to be scalable, maintainable, and robust, following the principles of **Feature-Sliced Design (FSD)**.

## Core Technologies

-   **Framework**: [Electron](https://www.electronjs.org/) (for the desktop application shell) and [React](https://reactjs.org/) (for the user interface).
-   **State Management**:
    -   [Zustand](https://github.com/pmndrs/zustand) for global client-side state.
    -   [TanStack Query (React Query)](https://tanstack.com/query/latest) for managing server state, including caching, refetching, and optimistic updates.
-   **UI Components**:
    -   [PrimeReact](https://primereact.org/) as the primary component library.
    -   [Tailwind CSS](https://tailwindcss.com/) for styling and customization.
-   **Testing**:
    -   [Vitest](https://vitest.dev/) for unit and integration testing.
    -   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing React components.
    -   [Playwright](https://playwright.dev/) for end-to-end testing.

## Architectural Overview

The frontend is an Electron application with two main processes:

1.  **Main Process**: This process runs in a Node.js environment and is responsible for creating and managing application windows (`BrowserWindow`), handling native OS events, and managing the application lifecycle. It's a thin wrapper that hosts the web-based UI.
2.  **Renderer Process**: This is the web page that runs inside a `BrowserWindow`. It is a standard React single-page application (SPA) responsible for rendering the UI.

The communication between the frontend and the backend is handled through a REST API, with the frontend making HTTP requests to the NestJS server.

## Feature-Sliced Design (FSD)

The renderer process is structured using the Feature-Sliced Design (FSD) methodology. This is a hierarchical and layered architecture that organizes code by business domain and scope of influence. The main layers are:

-   `app/`: The root layer, responsible for app-wide setup, including routing, global styles, and providers (e.g., TanStack Query provider, theme provider).

-   `pages/`: This layer is responsible for composing features and widgets into complete pages. For example, a `DashboardPage` would compose the `AudioUpload` feature, the `FilesList` widget, and the `Search` feature.

-   `features/`: This layer contains the application's business logic features. Each feature is self-contained and encapsulates a specific piece of functionality. Examples include:
    -   `feature-audio-upload`: The logic for uploading audio files.
    -   `feature-search`: the UI and logic for the search bar.

-   `entities/`: This layer contains business entities and the logic for working with them. For example:
    -   `entity-user`: Components and hooks related to the User entity.
    -   `entity-audio-file`: Components to display an audio file, and hooks to fetch its data.

-   `shared/`: This layer contains reusable code that is not tied to any specific business logic. This includes:
    -   UI components (buttons, inputs, etc.).
    -   Utility functions.
    -   Configuration settings.
    -   Hooks that are not tied to a specific entity.

This layered structure ensures a clear separation of concerns and a unidirectional data flow, making the application easier to understand, maintain, and scale.

## Communication with Backend

To accommodate both a fast web-based development workflow and a self-contained Electron application, the frontend uses a **conditional communication strategy**.

-   **Mechanism**: All API interactions are handled by a central **Axios** instance. This instance is configured with a conditional adapter.
-   **In a Web Browser**: When the app is run in a standard web browser for development, the Axios instance uses its default HTTP adapter to make direct network requests to the running `backend` server.
-   **In Electron**: When the app is packaged in Electron, a `preload` script securely exposes an IPC interface to the renderer process under the `window.api` object. The Axios instance detects this interface and automatically switches to a custom **`ipcAdapter`**. This adapter intercepts all outgoing requests and routes them over an IPC channel to the Electron Main Process, which then proxies the request to the appropriate background service (`backend` or `ai-service`).

This adapter pattern allows the application's data-fetching logic (e.g., TanStack Query hooks) to be written once, without needing to know whether it's running in a browser or in Electron.