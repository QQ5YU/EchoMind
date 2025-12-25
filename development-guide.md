# EchoMind Development Guide

This document outlines the development standards and workflows for the EchoMind project. All contributors are expected to follow these guidelines to ensure code quality, consistency, and a clear project history.

## 1. Git Branching Strategy (Git Flow)

We strictly follow the **Git Flow** workflow. This ensures a robust and structured development lifecycle.

### Core Branches
-   **`main`**: The stable, production-ready branch. Do not commit directly to this branch.
-   **`develop`**: The integration branch for features. This contains the latest delivered development changes for the next release.

### Supporting Branches

#### Feature Branches
-   **Naming**: `feature/description-of-feature` (e.g., `feature/001-mvp-audio-search`)
-   **Source**: Must branch off from `develop`.
-   **Merge Target**: Merge back into `develop` via Pull Request.
-   **Purpose**: Developing new features for the upcoming release.

#### Bugfix Branches
-   **Naming**: `bugfix/description-of-bug`
-   **Source**: `develop`.
-   **Merge Target**: `develop`.
-   **Purpose**: Fixing bugs found during development (non-production).

#### Release Branches
-   **Naming**: `release/vX.Y.Z` (e.g., `release/v1.0.0`)
-   **Source**: `develop`.
-   **Merge Target**: `main` (with tag) AND `develop`.
-   **Purpose**: Final preparation for a new production release (version bumping, minor bug fixes). No new features here.

#### Hotfix Branches
-   **Naming**: `hotfix/description-of-issue`
-   **Source**: `main`.
-   **Merge Target**: `main` (with tag) AND `develop`.
-   **Purpose**: Critical fixes for bugs currently in production.

### Workflow Summary
1.  **Start Feature**: `git checkout -b feature/my-feature develop`
2.  **Develop**: Commit changes following the commit message guidelines.
3.  **Finish Feature**: Merge `feature/my-feature` into `develop` (Squash and Merge is recommended for cleaner history).

---

## 2. Commit Message Guidelines

We adhere to the **Conventional Commits** specification, but with a strict requirement for detailed explanations in the commit body.

### Structure

```text
<type>(<scope>): <short summary>

<detailed description of WHY and WHAT changed>

<optional footer(s)>
```

### 1. Title Line (Header)
-   **Type**: Must be one of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
-   **Scope**: (Optional) The module or feature being affected (e.g., `mvp-audio-search`, `backend`, `ui`).
-   **Summary**: Concise description in present tense, lowercase, no period at the end.
-   **Limit**: Keep under 50-72 characters.

### 2. Body (MANDATORY)
-   **Cannot be empty.** You must provide context.
-   **Focus on "Why"**: Explain the reasoning behind the change, not just a repeat of the code.
-   **List Changes**: If multiple files or logical parts are modified, list them out using bullet points.
-   Wrap lines at 72 characters if possible.

### Example (Good Commit)

```text
feat(mvp-audio-search): Adjust sharing to local export for MVP

Based on user feedback, the functionality for generating public shareable links has been temporarily removed from the MVP scope. Instead, User Story 6 now focuses solely on exporting selected transcript segments as local text files.

The following documents were updated to reflect this change and maintain consistency:
- `specs/001-mvp-audio-search/spec.md`: User Story 6 was reworded to describe local text export.
- `specs/001-mvp-audio-search/contracts/rest-api-endpoints.md`: The '/share' API endpoint was removed.
- `specs/001-mvp-audio-search/data-model.md`: The 'SharedSnippet' entity was removed.
- `specs/001-mvp-audio-search/uiux-spec.md`: Flow 6 was updated to illustrate local text export.

This ensures the MVP scope is tightly bounded and achievable within the current phase.
```

### Example (Bad Commit)

```text
update specs
```
*(Why is it bad? No type, no scope, no description of what changed or why.)*

---

---

## 4. File Naming Convention

To ensure consistency across the repository, we follow specific naming rules for files.

### Documentation (Markdown)
-   **Rule**: Use **lowercase kebab-case**.
-   **Example**: `development-guide.md`, `api-endpoints.md`.
-   **Exception**: Standard root files like `README.md` or `LICENSE` may remain uppercase as per platform standards.

### Source Code
-   Follow the conventions of the specific language/framework (e.g., camelCase for TS files, snake_case for Python).
