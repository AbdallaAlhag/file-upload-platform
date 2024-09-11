/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `owner` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "lastOpenedAt" TIMESTAMP(3),
ADD COLUMN     "owner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";
