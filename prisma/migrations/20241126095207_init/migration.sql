/*
  Warnings:

  - You are about to drop the column `period` on the `StudentReport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,termId]` on the table `StudentReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `termId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `ReportDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admimissionStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `StudentReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "admissionStatus" AS ENUM ('PENDING', 'ADMITTED', 'COMPLETED', 'SUSPENDED', 'TERMINATED');

-- DropIndex
DROP INDEX "StudentReport_studentId_period_key";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "termId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "termId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "termId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReportDetail" ADD COLUMN     "termId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "admimissionStatus" "admissionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "StudentReport" DROP COLUMN "period",
ADD COLUMN     "termId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "identityNumber" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "taken" BOOLEAN,
    "userId" INTEGER,

    CONSTRAINT "identityNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentPreviousSchool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "studentPreviousSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identityNumber_number_key" ON "identityNumber"("number");

-- CreateIndex
CREATE UNIQUE INDEX "StudentReport_studentId_termId_key" ON "StudentReport"("studentId", "termId");

-- AddForeignKey
ALTER TABLE "identityNumber" ADD CONSTRAINT "identityNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentReport" ADD CONSTRAINT "StudentReport_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetail" ADD CONSTRAINT "ReportDetail_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
