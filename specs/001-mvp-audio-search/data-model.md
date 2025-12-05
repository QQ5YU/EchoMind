# Data Model for MVP Audio Search

This document defines the key data entities for the MVP feature, as derived from the feature specification. The storage mechanism will be a local SQLite database, and the schema below will be formally defined and managed via the **Prisma schema**.

## Entity: User

Represents a registered user of the application.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the user.
    -   `email` (Text, Not Null, Unique): The user's email address, used for login.
    -   `password_hash` (Text, Not Null): The user's hashed password.
    -   `created_at` (Timestamp, Not Null): The date and time the user registered.

-   **Relationships**:
    -   Has many `AudioFile` records.

## Entity: AudioFile

Represents an audio recording uploaded by a user.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the audio file record.
    -   `user_id` (Foreign Key, UUID, Not Null): A reference to the `User` who owns the file.
    -   `folder_id` (Foreign Key, UUID, Nullable): A reference to the `Folder` it belongs to.
    -   `file_name` (Text, Not Null): The original name of the uploaded audio file.
    -   `file_path` (Text, Not Null): The absolute path to the stored audio file on the user's local disk.
    -   `status` (Text, Not Null): The current processing status of the file.
    -   `created_at` (Timestamp, Not Null): The date and time when the file was uploaded.
    -   `updated_at` (Timestamp, Not Null): The date and time when the record was last updated.

-   **Relationships**:
    -   Belongs to one `User`.
    -   Belongs to one `Folder` (optional).
    -   Has one `Transcript`.

## Entity: Transcript

Represents the full transcribed text content of a single `AudioFile`.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the transcript.
    -   `audio_file_id` (Foreign Key, UUID, Not Null): A reference to the `AudioFile` it belongs to.
    -   `language` (Text): The language the transcription was performed in.

-   **Relationships**:
    -   Belongs to one `AudioFile`.
    -   Has many `TranscriptSegments`.

## Entity: TranscriptSegment

Represents a small, contiguous portion of a transcript with associated timing and search data.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the segment.
    -   `transcript_id` (Foreign Key, UUID, Not Null): A reference to the `Transcript` it belongs to.
    -   `text` (Text, Not Null): The transcribed text of the segment.
    -   `start_time` (Integer, Not Null): The start time of the segment in seconds.
    -   `end_time` (Integer, Not Null): The end time of the segment in seconds.
    -   `embedding` (Vector, Nullable): The vector embedding of the `text` field for semantic search. Note: For the MVP, this will be stored in SQLite, but it may be moved to a dedicated vector database in the future.

-   **Relationships**:
    -   Belongs to one `Transcript`.

## Entity: Folder

Represents a folder created by a user to organize their audio files.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the folder.
    -   `user_id` (Foreign Key, UUID, Not Null): A reference to the `User` who owns the folder.
    -   `name` (Text, Not Null): The name of the folder.
    -   `parent_id` (Foreign Key, UUID, Nullable): A reference to a parent folder for nesting.
    -   `created_at` (Timestamp, Not Null): The date and time the folder was created.

-   **Relationships**:
    -   Belongs to one `User`.
    -   Has many `AudioFile` records.
    -   Can have a parent `Folder`.
    -   Can have many child `Folder` records.

## Entity: SharedSnippet

Represents a shared link generated for a specific transcript segment.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the shared link.
    -   `segment_id` (Foreign Key, UUID, Not Null): A reference to the `TranscriptSegment` being shared.
    -   `share_token` (Text, Not Null, Unique): A unique token for the public URL.
    -   `created_at` (Timestamp, Not Null): The date and time the link was created.
    -   `expires_at` (Timestamp, Nullable): An optional expiration date for the link.

-   **Relationships**:
    -   Belongs to one `TranscriptSegment`.

## Entity: UserSetting

Stores key-value preferences for a user.

-   **Fields**:
    -   `id` (Primary Key, UUID): Unique identifier for the setting record.
    -   `user_id` (Foreign Key, UUID, Not Null): A reference to the `User`.
    -   `key` (Text, Not Null): The setting key (e.g., "default_transcription_language").
    -   `value` (Text, Not Null): The setting value (e.g., "English").

-   **Relationships**:
    -   Belongs to one `User`.

## State Transitions (AudioFile Status)

-   On upload: `pending` -> `processing`
-   On successful transcription: `processing` -> `processed`
-   On failed transcription: `processing` -> `error`