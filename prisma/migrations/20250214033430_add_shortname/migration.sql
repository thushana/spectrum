/*
  Warnings:

  - You are about to drop the column `slug` on the `Container` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Container_slug_key";

-- AlterTable
ALTER TABLE "Container" DROP COLUMN "slug";

-- CreateTable
CREATE TABLE "Shortname" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortname_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shortname_value_key" ON "Shortname"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Shortname_entityId_key" ON "Shortname"("entityId");

-- AddForeignKey
ALTER TABLE "Primitive" ADD CONSTRAINT "Primitive_id_fkey" FOREIGN KEY ("id") REFERENCES "Shortname"("entityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_id_fkey" FOREIGN KEY ("id") REFERENCES "Shortname"("entityId") ON DELETE RESTRICT ON UPDATE CASCADE;
