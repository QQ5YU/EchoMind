-- AlterTable
ALTER TABLE "users" ADD COLUMN "name" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_audio_files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "folder_id" TEXT,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "audio_files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "audio_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_audio_files" ("created_at", "file_name", "file_path", "folder_id", "id", "status", "updated_at", "user_id") SELECT "created_at", "file_name", "file_path", "folder_id", "id", "status", "updated_at", "user_id" FROM "audio_files";
DROP TABLE "audio_files";
ALTER TABLE "new_audio_files" RENAME TO "audio_files";
CREATE TABLE "new_folders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_folders" ("created_at", "id", "name", "parent_id", "user_id") SELECT "created_at", "id", "name", "parent_id", "user_id" FROM "folders";
DROP TABLE "folders";
ALTER TABLE "new_folders" RENAME TO "folders";
CREATE TABLE "new_transcript_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcript_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "embedding" BLOB,
    CONSTRAINT "transcript_segments_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "transcripts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transcript_segments" ("embedding", "end_time", "id", "start_time", "text", "transcript_id") SELECT "embedding", "end_time", "id", "start_time", "text", "transcript_id" FROM "transcript_segments";
DROP TABLE "transcript_segments";
ALTER TABLE "new_transcript_segments" RENAME TO "transcript_segments";
CREATE TABLE "new_transcripts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "audio_file_id" TEXT NOT NULL,
    "language" TEXT,
    CONSTRAINT "transcripts_audio_file_id_fkey" FOREIGN KEY ("audio_file_id") REFERENCES "audio_files" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transcripts" ("audio_file_id", "id", "language") SELECT "audio_file_id", "id", "language" FROM "transcripts";
DROP TABLE "transcripts";
ALTER TABLE "new_transcripts" RENAME TO "transcripts";
CREATE UNIQUE INDEX "transcripts_audio_file_id_key" ON "transcripts"("audio_file_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
