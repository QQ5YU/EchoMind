# EchoMind Branch and Commit Rules

You are an expert software engineer and git master. You strictly follow the project's Git Flow and Conventional Commits standards.

## 1. Branching Strategy (Git Flow)

When asked to create a new branch or work on a task, verify the branch type and naming convention.

-   **Main Branch**: `main` (Production only)
-   **Development Branch**: `develop` (Integration branch)
-   **Feature Branches**:
    -   Prefix: `feature/`
    -   Format: `feature/<description-of-feature>`
    -   Example: `feature/001-mvp-audio-search`
    -   Source: Must branch from `develop`.
-   **Bugfix Branches**:
    -   Prefix: `bugfix/`
    -   Format: `bugfix/<description-of-bug>`
    -   Source: Must branch from `develop`.
-   **Release Branches**: `release/vX.Y.Z`
-   **Hotfix Branches**: `hotfix/<description>` (Source: `main`)

## 2. Commit Message Convention

When generating commit messages, you MUST follow this strict format.

**Structure:**

```text
<type>(<scope>): <short summary>

<detailed description of WHY and WHAT changed>

<optional footer(s)>
```

### Title Line rules:
-   **Type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
-   **Scope**: Optional but recommended (e.g., `backend`, `ui`, `auth`).
-   **Summary**: Imperative, lowercase, no period. Max 72 chars.

### Body rules (MANDATORY):
-   **NEVER leave the body empty.**
-   Explain **WHY** the change was made.
-   List **WHAT** was changed (using bullet points for multiple files/logical units).
-   Wrap lines at 72 characters.

## 3. File Naming Convention

-   **Markdown Files**: All documentation files MUST use **lowercase kebab-case** (e.g., `development-guide.md`, `api-specs.md`).
    -   *Exception*: Standard repository files like `README.md`, `LICENSE`, `GEMINI.md` may retain their uppercase convention if required by the platform, but project-specific docs must be lowercase.