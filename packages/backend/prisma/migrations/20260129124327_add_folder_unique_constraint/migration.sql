/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name,parent_id]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folders_user_id_name_parent_id_key" ON "folders"("user_id", "name", "parent_id");
