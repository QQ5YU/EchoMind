# Quickstart Guide: EchoMind MVP

This guide provides the basic steps to set up and run the EchoMind MVP client-server application on a local development machine.

## Prerequisites

-   **Node.js**: Latest LTS version
-   **pnpm**: Latest version (replaces npm/yarn)
-   **Python**: Latest stable version
-   **Git**: Latest version
-   **Redis**: A running Redis instance (e.g., via a local install or Docker).

## 1. Initial Project Setup

First, clone the repository and install all dependencies for the backend and desktop client using pnpm.

```bash
# Clone the repository (if you haven't already)
# git clone [repository-url]

# Navigate to the project root
cd EchoMind

# Install all dependencies for both packages
pnpm install
```

## 2. Environment Setup

Copy the example environment file for the backend.

```bash
cd packages/backend
cp .env.example .env
```
This file will contain the database URL and other environment variables.

## 3. Database Setup

Run the Prisma command to set up the SQLite database and generate the Prisma client.

```bash
# From the project root
pnpm prisma db push --schema=./packages/backend/src/prisma/schema.prisma
pnpm prisma generate --schema=./packages/backend/src/prisma/schema.prisma
```
*Note: pnpm can directly run binaries from `node_modules`, so `npx` is not needed.*

## 4. Running the Application (Development)

You need to run the backend server and the desktop client in two separate terminals.

### Terminal 1: Run the Backend

```bash
# Start the NestJS server in watch mode from the root
pnpm --filter backend start:dev
```
The backend API will be available at `http://localhost:3000`. The Swagger API documentation will be available at `http://localhost:3001`.

### Terminal 2: Run the Desktop Client

```bash
# Start the Electron application from the root
pnpm --filter desktop-client start
```

## 5. Building the Application

To build the distributable applications:

```bash
# Build the backend (creates a production build in packages/backend/dist)
pnpm --filter backend build

# Build the desktop client installer
pnpm --filter desktop-client dist
```
The packaged desktop application will be located in the `packages/desktop-client/dist/` directory.
