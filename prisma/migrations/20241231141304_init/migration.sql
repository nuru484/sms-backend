/*
  Warnings:

  - You are about to drop the column `passwordHistory` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "digitalSignature" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHistory";
