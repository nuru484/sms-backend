/*
  Warnings:

  - You are about to drop the column `healthInsurancePolicyNumber` on the `HealthAndSafety` table. All the data in the column will be lost.
  - You are about to drop the column `healthInsuranceProvider` on the `HealthAndSafety` table. All the data in the column will be lost.
  - The `allergies` column on the `HealthAndSafety` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `medicalConditions` column on the `HealthAndSafety` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `levelId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `StudentApplicationNumber` table. All the data in the column will be lost.
  - Added the required column `studentApplicationNumberId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_levelId_fkey";

-- DropForeignKey
ALTER TABLE "StudentApplicationNumber" DROP CONSTRAINT "StudentApplicationNumber_studentId_fkey";

-- AlterTable
ALTER TABLE "HealthAndSafety" DROP COLUMN "healthInsurancePolicyNumber",
DROP COLUMN "healthInsuranceProvider",
ADD COLUMN     "healthInsurancePolicyId" TEXT,
DROP COLUMN "allergies",
ADD COLUMN     "allergies" TEXT[],
DROP COLUMN "medicalConditions",
ADD COLUMN     "medicalConditions" TEXT[];

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "levelId",
ADD COLUMN     "studentApplicationNumberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudentApplicationNumber" DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "_LevelToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LevelToStudent_AB_unique" ON "_LevelToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_LevelToStudent_B_index" ON "_LevelToStudent"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentApplicationNumberId_fkey" FOREIGN KEY ("studentApplicationNumberId") REFERENCES "StudentApplicationNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LevelToStudent" ADD CONSTRAINT "_LevelToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LevelToStudent" ADD CONSTRAINT "_LevelToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
