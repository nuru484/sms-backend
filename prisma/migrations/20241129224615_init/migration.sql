/*
  Warnings:

  - You are about to drop the column `subject` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "levelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "subject";
