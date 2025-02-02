/*
  Warnings:

  - You are about to drop the column `location` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attendance_userId_date_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "location",
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_key" ON "Attendance"("userId", "date");
