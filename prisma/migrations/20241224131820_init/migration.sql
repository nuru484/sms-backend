/*
  Warnings:

  - The `courses` column on the `AcademicPerformance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialPrograms` column on the `AcademicPerformance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `category` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Attendance` table. All the data in the column will be lost.
  - The `extracurriculars` column on the `BehaviorAndExtracurricular` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `achievements` column on the `BehaviorAndExtracurricular` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "attendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED', 'LATE');

-- AlterTable
ALTER TABLE "AcademicPerformance" DROP COLUMN "courses",
ADD COLUMN     "courses" TEXT[],
DROP COLUMN "specialPrograms",
ADD COLUMN     "specialPrograms" TEXT[];

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "remarks",
DROP COLUMN "updatedAt",
ADD COLUMN     "location" TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "attendanceStatus" NOT NULL,
ALTER COLUMN "recorderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BehaviorAndExtracurricular" DROP COLUMN "extracurriculars",
ADD COLUMN     "extracurriculars" TEXT[],
DROP COLUMN "achievements",
ADD COLUMN     "achievements" TEXT[];
