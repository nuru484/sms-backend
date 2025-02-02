/*
  Warnings:

  - The `achievements` column on the `ExtracurricularActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExtracurricularActivity" DROP COLUMN "achievements",
ADD COLUMN     "achievements" TEXT[];
