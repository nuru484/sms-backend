/*
  Warnings:

  - You are about to drop the column `achievements` on the `ExtracurricularActivity` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `ExtracurricularActivity` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `ExtracurricularActivity` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ExtracurricularActivity` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `ExtracurricularActivity` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ExtracurricularActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExtracurricularActivity" DROP CONSTRAINT "ExtracurricularActivity_studentId_fkey";

-- DropIndex
DROP INDEX "User_resetToken_key";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description" VARCHAR(255);

-- AlterTable
ALTER TABLE "ExtracurricularActivity" DROP COLUMN "achievements",
DROP COLUMN "endDate",
DROP COLUMN "position",
DROP COLUMN "startDate",
DROP COLUMN "studentId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetPasswordTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "studentExtracurricularActivities" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "position" TEXT,
    "remarks" TEXT,
    "achievements" TEXT[],
    "studentId" INTEGER NOT NULL,
    "extracurricularActivityId" INTEGER NOT NULL,

    CONSTRAINT "studentExtracurricularActivities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- AddForeignKey
ALTER TABLE "studentExtracurricularActivities" ADD CONSTRAINT "studentExtracurricularActivities_extracurricularActivityId_fkey" FOREIGN KEY ("extracurricularActivityId") REFERENCES "ExtracurricularActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentExtracurricularActivities" ADD CONSTRAINT "studentExtracurricularActivities_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
