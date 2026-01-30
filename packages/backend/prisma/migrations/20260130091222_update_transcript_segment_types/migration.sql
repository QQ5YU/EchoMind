/*
  Warnings:

  - You are about to drop the column `embedding` on the `transcript_segments` table. All the data in the column will be lost.
  - You are about to alter the column `end_time` on the `transcript_segments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `start_time` on the `transcript_segments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transcript_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcript_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "start_time" REAL NOT NULL,
    "end_time" REAL NOT NULL,
    CONSTRAINT "transcript_segments_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "transcripts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transcript_segments" ("end_time", "id", "start_time", "text", "transcript_id") SELECT "end_time", "id", "start_time", "text", "transcript_id" FROM "transcript_segments";
DROP TABLE "transcript_segments";
ALTER TABLE "new_transcript_segments" RENAME TO "transcript_segments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
