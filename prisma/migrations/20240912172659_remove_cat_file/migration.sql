/*
  Warnings:

  - You are about to drop the column `categoryId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FileCategory" DROP CONSTRAINT "FileCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FileCategory" DROP CONSTRAINT "FileCategory_fileId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "categoryId",
DROP COLUMN "owner";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "FileCategory";
