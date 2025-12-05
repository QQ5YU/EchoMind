# Implementation Plan: MVP Audio Search

**Branch**: `001-mvp-audio-search` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/workspaces/EchoMind/specs/001-mvp-audio-search/spec.md`

## Summary

This plan outlines the technical implementation for the EchoMind MVP. The goal is to build a desktop application using Electron and React that allows users to upload audio, have it transcribed via a background Python process, and perform semantic search on the content. This implementation explicitly excludes the internal workings of the AI models, treating them as a black box invoked via a CLI contract.

## Technical Context

The technical decisions below are based on the project's foundational document (`core.md`) and have been finalized in the [research.md](./research.md) document. This plan now reflects a **client-server architecture**.

**Language/Version**: 
- Node.js (LTS) for Backend (NestJS)
- React 18 for Frontend
- Python 3.11 for AI Scripts

**Primary Dependencies**: 
- **Backend**: NestJS, Prisma, Zod, Redis
-   **Frontend**: Electron, React, PrimeReact (for UI components), Tailwind CSS (for styling and customization), Zustand, TanStack Query
- **Testing**: Vitest, React Testing Library, Playwright

**Storage**: 
- **Structured Data**: Local SQLite database managed via Prisma in the backend (`backend/storage/database.sqlite`).
- **Caching & Queues**: Redis.
- **File Storage**: Local file system managed by the backend (`backend/storage/audio`).

**Testing**: 
- **Backend**: Unit and E2E tests within the NestJS framework.
- **Frontend**: Vitest + React Testing Library for components; Playwright for E2E tests.

**Target Platform**: 
- **Backend**: Cross-platform Node.js environment.
- **Frontend**: Windows, macOS, Linux (as supported by Electron).

**Project Type**: Client-Server (Electron Desktop Client + NestJS Web API).

**Performance Goals**: API response times <200ms for standard requests.
**Constraints**: The AI processing pipeline is still local to the backend server.
**Scale/Scope**: Multi-user support for the MVP.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clean Code Architecture**: **PASS**. The design uses a clear separation of concerns: a Domain-Driven Design (DDD) structure in the NestJS backend, and Feature-Sliced Design (FSD) in the React frontend. Both methodologies enforce strict architectural rules.
- **II. Comprehensive Testing**: **PASS**. The plan specifies a clear testing strategy for both the backend and frontend.
- **III. Consistent User Experience**: **PASS**. The combination of PrimeReact for robust UI components and Tailwind CSS for flexible styling and customization ensures a consistent and adaptable user experience.
- **IV. Performance by Design**: **PASS**. The architecture separates the client, server, and AI processing, allowing each to be scaled and optimized independently.
- **V. Standardized Git Workflow**: **PASS**. This work is being performed in a dedicated feature branch.
- **VI. Conventional Commit Messages**: **PASS**. All commits will adhere to the Conventional Commits specification.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-audio-search/
├── plan.md              # This file
├── research.md          # Phase 0 output, technical decisions
├── data-model.md        # Phase 1 output, DB schema
├── quickstart.md        # Phase 1 output, setup guide
├── contracts/           # Phase 1 output, service interfaces
│   ├── ai-script-interface.md
│   └── rest-api-endpoints.md # (Replaces ipc-channels.md)
└── tasks.md             # (To be created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── backend/               # NestJS Backend (Domain-Driven Design)
│   ├── src/
│   │   ├── auth/          # Authentication module (JWT, Passport)
│   │   ├── users/         # "Users" domain module
│   │   │   ├── application/
│   │   │   │   └── users.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── users.repository.ts
│   │   │   └── infrastructure/
│   │   │       ├── users.controller.ts
│   │   │       └── users.prisma.repository.ts
│   │   ├── audio/         # "Audio" domain module
│   │   │   ├── application/
│   │   │   │   └── audio.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── audio.entity.ts
│   │   │   │   └── audio.repository.ts
│   │   │   └── infrastructure/
│   │   │       ├── audio.controller.ts
│   │   │       └── audio.prisma.repository.ts
│   │   ├── core/          # Shared kernel/cross-cutting concerns
│   │   │   ├── prisma/
│   │   │   └── redis/
│   │   └── main.ts
│   ├── test/
│   └── storage/           # (gitignored) DB and audio files
└── desktop-client/        # Electron + React Frontend
    ├── src/
    │   ├── main/          # Electron Main process (thin wrapper)
    │   └── renderer/      # React UI (Feature-Sliced Design)
    │       ├── app/
    │       ├── pages/
    │       ├── features/
    │       ├── entities/
    │       └── shared/
    └── test/

scripts/                   # Build and utility scripts
└── ai/                    # Python AI scripts (invoked by backend)
    └── process_audio.py
```

**Structure Decision**: A monorepo structure is chosen to manage the two main packages: `backend` and `desktop-client`.
- The `backend` is a NestJS application structured using **Domain-Driven Design (DDD)**. Code is organized by business domain modules, each with distinct application, domain, and infrastructure layers.
- The `desktop-client` is an Electron application where the `renderer` follows **Feature-Sliced Design (FSD)**.
This provides a robust and scalable separation of concerns across the entire stack.

## Complexity Tracking

No violations of the constitution were required. This section is not applicable.