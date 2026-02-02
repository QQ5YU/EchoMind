<div align="center">
  <img src="packages/desktop-client/src/renderer/assets/logo/light/logo.svg" alt="EchoMind Logo" width="200" height="200">

# EchoMind

**Capture the Sound. Index the Value.**

A next-generation desktop application that transforms your audio library into a structured, searchable knowledge base using local AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-28-grey)](https://www.electronjs.org/)
[![FSD](https://img.shields.io/badge/Architecture-FSD-green)](https://feature-sliced.design/)

</div>

---

## 📖 About

**EchoMind** is an AI-powered desktop application designed to bridge the gap between raw audio and actionable knowledge. By combining precise audio ingestion ('Echo') with RAG-based intelligence ('Mind'), it allows you to:

- **Upload & Transcribe**: Automatically convert meetings, lectures, and voice notes into text using `faster-whisper`.
- **Semantic Search**: Don't just search for keywords; search for _concepts_. Find the exact moment a topic was discussed.
- **Interactive Playback**: Click on any word in the transcript to jump the audio to that exact timestamp.
- **Organize**: Manage your audio library with folders and smart tagging.

---

## ✨ Key Features

### 🔐 Secure Authentication

- User registration and login to keep your data private and isolated.
- Secure session management.

### 🎙️ Audio Intelligence

- **Automatic Transcription**: High-accuracy ASR (Automatic Speech Recognition) powered by `faster-whisper` running in a dedicated Python service.
- **Vector Search**: Uses `sentence-transformers` to create embeddings for semantic search across your entire audio library.
- **Microservice Architecture**: AI processing runs as a separate service for better performance and scalability.
- **Full Privacy**: All processing happens locally on your machine - no cloud dependencies.

### 🎧 Enhanced Playback

- **Transcript Sync**: The audio player is tightly synchronized with the text. Click to seek.
- **Speed Control**: Adjustable playback speed (0.5x - 2.0x) for efficient review.
- **Smart Export**: Select any portion of the transcript and export it as a text file for your notes.

### 📂 File Management

- **Folder Organization**: Create projects and folders to organize your recordings.
- **Bulk Upload**: Drag and drop support for multiple files.
- **Status Tracking**: Real-time status updates (Uploading -> Processing -> Ready).

---

## 🛠️ Technology Stack

EchoMind is built with a modern, scalable architecture following **Feature-Sliced Design (FSD)** for the frontend and **Clean Architecture** for the backend.

- **Frontend**: React, TypeScript, Tailwind CSS, PrimeReact
- **Desktop Runtime**: Electron (via `electron-vite`)
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL
- **AI Service**: Python, FastAPI, Faster Whisper, Sentence Transformers
- **Shared**: TypeScript, Zod schemas, Shared DTOs/interfaces
- **State Management**: Zustand, TanStack Query
- **Build Tool**: pnpm workspaces, Vite
- **Architecture**: Feature-Sliced Design (FSD)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Python (v3.10+)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/echomind.git
    cd echomind
    ```

2.  **Install Dependencies**

    ```bash
    pnpm install
    ```

3.  **Set up the database**

    ```bash
    # Copy environment file
    cp packages/backend/.env.example packages/backend/.env

    # Generate Prisma client
    cd packages/backend
    pnpm prisma generate
    pnpm prisma migrate dev
    ```

4.  **Run Development Environment**

    ```bash
    # Run all services (backend + frontend)
    pnpm dev

    # Or run individually:
    pnpm backend:dev    # Start NestJS API server
    pnpm client:dev     # Start Electron dev server
    ```

### Development Scripts

- `pnpm dev` - Start all services in development mode
- `pnpm backend:dev` - Start only the backend API
- `pnpm client:dev` - Start only the desktop client
- `pnpm build` - Build all packages for production
- `pnpm test` - Run tests across all packages

---

## 📂 Project Structure

This is a **pnpm monorepo** with multiple packages. We follow **Feature-Sliced Design (FSD)** for the frontend and **Clean Architecture** for the backend.

```text
packages/
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── user/         # User management
│   │   ├── audio/        # Audio processing & upload
│   │   ├── transcripts/  # Transcript management
│   │   ├── folders/      # Folder organization
│   │   ├── search/       # Semantic search
│   │   ├── settings/     # User settings
│   │   └── core/         # Shared services (DB, events, storage)
│   ├── prisma/           # Database schema & migrations
│   └── tsconfig.json     # TypeScript config with path aliases
├── desktop-client/       # Electron desktop application
│   ├── src/
│   │   ├── main/         # Electron main process
│   │   ├── preload/      # Electron preload scripts
│   │   └── renderer/     # React frontend (FSD architecture)
│   │       ├── app/      # Global providers & routing
│   │       ├── pages/    # Page compositions
│   │       ├── widgets/  # UI component compositions
│   │       ├── features/ # Business logic features
│   │       ├── entities/ # Domain models & API
│   │       └── shared/   # Reusable UI & utilities
│   └── electron.vite.config.ts
├── ai-service/           # Python AI processing service
│   ├── main.py           # FastAPI server
│   ├── application/      # Use cases
│   ├── domain/           # Domain models
│   ├── infrastructure/   # External integrations
│   └── utils/            # Utilities
└── shared/               # Shared TypeScript types & schemas
    ├── src/
    │   ├── dtos/         # Data transfer objects
    │   ├── enums/        # Shared enums
    │   ├── interfaces/   # TypeScript interfaces
    │   └── schemas/      # Zod validation schemas
    └── tsconfig.json
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the EchoMind Team.</sub>
</div>
