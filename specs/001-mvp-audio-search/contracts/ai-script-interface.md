# AI Service IPC Contract

This document defines the Inter-Process Communication (IPC) contract between the NestJS backend and the AI Service sidecar process. The backend communicates with the AI service by writing newline-delimited JSON messages to its `stdin` and reading newline-delimited JSON messages from its `stdout`.

## Communication Protocol

-   **Transport**: `stdin` for requests (Backend -> AI Service), `stdout` for responses (AI Service -> Backend).
-   **Format**: All messages are single-line JSON strings, terminated by a newline character (`\n`).
-   **Correlation**: Each request message MUST include a unique `request_id`. The corresponding response message MUST carry the same `request_id` to allow the backend to correlate responses with requests.

---

## Message Types

### 1. Transcribe Request

-   **Description**: Sent by the backend to request the transcription and embedding of an audio file.
-   **Direction**: Backend -> AI Service (`stdin`)
-   **JSON Message**:
    ```json
    {
      "type": "transcribe",
      "request_id": "unique-uuid-for-this-request",
      "payload": {
        "audio_file_path": "/path/to/audio.mp3",
        "audio_file_id": "uuid-of-audio-file",
        "language": "en"
      }
    }
    ```
    -   `type` (string, required): Must be `"transcribe"`.
    -   `request_id` (string, required): A unique identifier for the request.
    -   `payload.audio_file_path` (string, required): Absolute path to the audio file.
    -   `payload.audio_file_id` (string, required): The ID of the `AudioFile` record.
    -   `payload.language` (string, optional): The language of the audio file.

### 2. Transcribe Response

-   **Description**: Sent by the AI service after it has finished processing a transcribe request.
-   **Direction**: AI Service -> Backend (`stdout`)
-   **JSON Message (Success)**:
    ```json
    {
      "type": "transcribe_response",
      "request_id": "unique-uuid-for-this-request",
      "status": "success",
      "payload": {
        "transcript_id": "uuid-of-transcript",
        "message": "Transcription and embedding complete."
      }
    }
    ```
-   **JSON Message (Error)**:
    ```json
    {
      "type": "transcribe_response",
      "request_id": "unique-uuid-for-this-request",
      "status": "error",
      "payload": {
        "message": "A description of what went wrong."
      }
    }
    ```
    -   `type` (string, required): Must be `"transcribe_response"`.
    -   `request_id` (string, required): The `request_id` from the original request.
    -   `status` (string, required): `"success"` or `"error"`.

---

### 3. Search Request

-   **Description**: Sent by the backend to perform a semantic search.
-   **Direction**: Backend -> AI Service (`stdin`)
-   **JSON Message**:
    ```json
    {
      "type": "search",
      "request_id": "unique-uuid-for-search-request",
      "payload": {
        "query_text": "text to search for",
        "user_id": "uuid-of-user"
      }
    }
    ```
    -   `type` (string, required): Must be `"search"`.
    -   `request_id` (string, required): A unique identifier for the request.
    -   `payload.query_text` (string, required): The search query.
    -   `payload.user_id` (string, required): The user ID to scope the search.

### 4. Search Response

-   **Description**: Sent by the AI service with the results of a search request.
-   **Direction**: AI Service -> Backend (`stdout`)
-   **JSON Message (Success)**:
    ```json
    {
      "type": "search_response",
      "request_id": "unique-uuid-for-search-request",
      "status": "success",
      "payload": {
        "segment_ids": ["uuid-1", "uuid-2", ...],
        "message": "Search complete."
      }
    }
    ```
-   **JSON Message (Error)**:
    ```json
    {
      "type": "search_response",
      "request_id": "unique-uuid-for-search-request",
      "status": "error",
      "payload": {
        "message": "A description of what went wrong during search."
      }
    }
    ```
    -   `type` (string, required): Must be `"search_response"`.
    -   `request_id` (string, required): The `request_id` from the original request.
    -   `status` (string, required): `"success"` or `"error"`.

---
## Error Handling

In addition to the `status: "error"` in response messages, the AI service can write error information to `stderr`. The backend should monitor the `stderr` stream for critical errors that might prevent the AI service from functioning correctly (e.g., model loading failures, unhandled exceptions).