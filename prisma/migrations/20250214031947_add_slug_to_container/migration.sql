/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Container` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Container_slug_key" ON "Container"("slug");
