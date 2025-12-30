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

-   **Upload & Transcribe**: Automatically convert meetings, lectures, and voice notes into text using `faster-whisper`.
-   **Semantic Search**: Don't just search for keywords; search for *concepts*. Find the exact moment a topic was discussed.
-   **Interactive Playback**: Click on any word in the transcript to jump the audio to that exact timestamp.
-   **Organize**: Manage your audio library with folders and smart tagging.

---

## ✨ Key Features

### 🔐 Secure Authentication
-   User registration and login to keep your data private and isolated.
-   Secure session management.

### 🎙️ Audio Intelligence
-   **Automatic Transcription**: High-accuracy ASR (Automatic Speech Recognition) powered by `faster-whisper`.
-   **Vector Search**: Uses `sentence-transformers` to index your content, enabling deep semantic search capabilities.
-   **Full Privacy**: All processing happens locally or on your private server instance.

### 🎧 Enhanced Playback
-   **Transcript Sync**: The audio player is tightly synchronized with the text. Click to seek.
-   **Speed Control**: Adjustable playback speed (0.5x - 2.0x) for efficient review.
-   **Smart Export**: Select any portion of the transcript and export it as a text file for your notes.

### 📂 File Management
-   **Folder Organization**: Create projects and folders to organize your recordings.
-   **Bulk Upload**: Drag and drop support for multiple files.
-   **Status Tracking**: Real-time status updates (Uploading -> Processing -> Ready).

---

## 🛠️ Technology Stack

EchoMind is built with a modern, scalable architecture following **Feature-Sliced Design (FSD)** principles.

-   **Frontend**: React, TypeScript, Tailwind CSS, PrimeReact
-   **Desktop Runtime**: Electron (via `electron-vite`)
-   **State Management**: Zustand, TanStack Query
-   **AI Engine**: Python, Faster Whisper, Sentence Transformers
-   **Architecture**: Feature-Sliced Design (FSD)

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   pnpm (v8+)
-   Python (v3.10+)

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

3.  **Run Development Server**
    ```bash
    pnpm dev
    ```

---

## 📂 Project Structure (FSD)

We strictly follow the **Feature-Sliced Design** methodology to ensure maintainability and scalability.

```text
src/renderer/
├── app/          # Global providers, styles, and routing
├── pages/        # Composition of Widgets for specific routes (Login, Dashboard)
├── widgets/      # Composition of Features (Sidebar, UserMenu)
├── features/     # Business scenarios (Search, FileBrowser, Playback)
├── entities/     # Domain models (FileSystem, Settings)
└── shared/       # Reusable UI kits and utilities
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the EchoMind Team.</sub>
</div>