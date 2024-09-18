/*
  Warnings:

  - You are about to drop the `_SharedFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SharedFiles" DROP CONSTRAINT "_SharedFiles_A_fkey";

-- DropForeignKey
ALTER TABLE "_SharedFiles" DROP CONSTRAINT "_SharedFiles_B_fkey";

-- DropTable
DROP TABLE "_SharedFiles";

-- CreateTable
CREATE TABLE "SharedFile" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SharedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedFile_fileId_userId_key" ON "SharedFile"("fileId", "userId");

-- AddForeignKey
ALTER TABLE "SharedFile" ADD CONSTRAINT "SharedFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFile" ADD CONSTRAINT "SharedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
