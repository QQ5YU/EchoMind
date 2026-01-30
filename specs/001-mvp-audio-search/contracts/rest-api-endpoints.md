# REST API Endpoints

This document defines the RESTful API endpoints provided by the NestJS backend. The Electron desktop client will interact with this API over HTTP.

## Authentication

### `POST /auth/register`

-   **Description**: Registers a new user.
-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "a-strong-password"
    }
    ```
-   **Response**: `201 Created`
    -   **Body**: The created `User` object and JWT tokens.

### `POST /auth/login`

-   **Description**: Logs in a user and returns JWT tokens.
-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "a-strong-password"
    }
    ```
-   **Response**: `200 OK`
    -   **Body**: The `User` object and JWT tokens.

### `POST /auth/logout`

-   **Description**: Logs out a user by invalidating their session/token.
-   **Response**: `200 OK`

### `POST /auth/refresh`

-   **Description**: Issues a new access token using a valid refresh token.
-   **Request Body**: (The refresh token is typically sent in a secure, HttpOnly cookie).
-   **Response**: `200 OK`
    -   **Body**: A new access token.

## Audio Files (Protected)

*All endpoints in this section require a valid JWT access token in the `Authorization` header.*

### `POST /audio`

-   **Description**: Uploads a new audio file for processing for the authenticated user.
-   **Request Body**: `multipart/form-data` with a `file` and an optional `folderId` string.
-   **Response**: `201 Created`
    -   **Body**: The `AudioFile` object.



### `GET /audio`

-   **Description**: Retrieves a list of all audio files belonging to the authenticated user.
-   **Response**: `200 OK`
    -   **Body**: An array of `AudioFile` objects.

### `GET /audio/{id}`

-   **Description**: Retrieves a single audio file by its ID. The user must be the owner of the file.
-   **Response**: `200 OK` or `404 Not Found`.
    -   **Body**: The `AudioFile` object.

### `DELETE /audio/{id}`

-   **Description**: Deletes a single audio file by its ID. The user must be the owner of the file.
-   **Response**: `200 OK`
    -   **Body**: `{ "id": "deleted-audio-file-id" }`

### `GET /audio/{id}/file`

-   **Description**: Streams the audio file content by its ID. The user must be the owner of the file. Supports range requests.
-   **Response**: `200 OK` (full content) or `206 Partial Content` (range request)
    -   **Body**: Audio file stream.

## File Management (Protected)

*All endpoints in this section require a valid JWT access token.*

### `GET /folders`

-   **Description**: Retrieves the folder structure for the authenticated user.
-   **Response**: `200 OK`
    -   **Body**: An array of `Folder` objects, possibly nested.

### `POST /folders`

-   **Description**: Creates a new folder.
-   **Request Body**:
    ```json
    {
      "name": "My New Folder",
      "parentId": "optional-parent-folder-id"
    }
    ```
-   **Response**: `201 Created`
    -   **Body**: The created `Folder` object.

### `DELETE /folders/{id}`

-   **Description**: Deletes a folder by its ID. The user must be the owner of the folder.
-   **Response**: `200 OK`
    -   **Body**: `{ "id": "deleted-folder-id" }`



## Transcripts (Protected)

*All endpoints in this section require a valid JWT access token.*

### `GET /audio/{id}/transcript`

-   **Description**: Retrieves the full transcript for a given audio file ID. The user must be the owner of the file.
-   **Response**: `200 OK` or `404 Not Found`.
    -   **Body**: The transcript object.

## Search (Protected)

*All endpoints in this section require a valid JWT access token.*

### `GET /search`

-   **Description**: Performs a semantic search across all processed audio files belonging to the authenticated user.
-   **Query Parameters**:
    -   `q` (string, required): The search query.
-   **Response**: `200 OK`
    -   **Body**: An array of search result objects. Each object has the following structure:
        ```json
        [
          {
            "segmentId": "a-uuid-for-the-segment",
            "text": "The text of the matching transcript segment...",
            "startTime": 123,
            "endTime": 128,
            "audioFile": {
              "id": "a-uuid-for-the-audio-file",
              "fileName": "meeting-notes.mp3"
            }
          }
        ]
        ```

## Settings (Protected)

*All endpoints in this section require a valid JWT access token.*

### `GET /settings/transcription`

-   **Description**: Retrieves the user's current transcription settings.
-   **Response**: `200 OK`
    -   **Body**: `{ "defaultLanguage": "English" }`

### `PUT /settings/transcription`

-   **Description**: Updates the user's transcription settings.
-   **Request Body**:
    ```json
    {
      "defaultLanguage": "Spanish"
    }
    ```
-   **Response**: `200 OK`.