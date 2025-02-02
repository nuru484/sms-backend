/*
  Warnings:

  - You are about to drop the column `eventDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[academicCalendarId,name,date]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academicCalendarId,name]` on the table `Term` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicCalendarId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicCalendarId` to the `Term` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Term` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventDate",
DROP COLUMN "location",
ADD COLUMN     "academicCalendarId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Term" DROP COLUMN "end",
DROP COLUMN "start",
DROP COLUMN "year",
ADD COLUMN     "academicCalendarId" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metadata" JSONB;

-- DropTable
DROP TABLE "EventParticipant";

-- CreateTable
CREATE TABLE "AcademicCalendar" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "academicCalendarId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "termId" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicCalendar_year_key" ON "AcademicCalendar"("year");

-- CreateIndex
CREATE INDEX "AcademicCalendar_startDate_idx" ON "AcademicCalendar"("startDate");

-- CreateIndex
CREATE INDEX "AcademicCalendar_endDate_idx" ON "AcademicCalendar"("endDate");

-- CreateIndex
CREATE INDEX "Holiday_date_idx" ON "Holiday"("date");

-- CreateIndex
CREATE INDEX "Holiday_academicCalendarId_idx" ON "Holiday"("academicCalendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_academicCalendarId_date_key" ON "Holiday"("academicCalendarId", "date");

-- CreateIndex
CREATE INDEX "Session_startDate_idx" ON "Session"("startDate");

-- CreateIndex
CREATE INDEX "Session_endDate_idx" ON "Session"("endDate");

-- CreateIndex
CREATE INDEX "Session_termId_idx" ON "Session"("termId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_termId_name_key" ON "Session"("termId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "_EventToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUser_B_index" ON "_EventToUser"("B");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_academicCalendarId_idx" ON "Event"("academicCalendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_academicCalendarId_name_date_key" ON "Event"("academicCalendarId", "name", "date");

-- CreateIndex
CREATE INDEX "Term_startDate_idx" ON "Term"("startDate");

-- CreateIndex
CREATE INDEX "Term_endDate_idx" ON "Term"("endDate");

-- CreateIndex
CREATE INDEX "Term_academicCalendarId_idx" ON "Term"("academicCalendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Term_academicCalendarId_name_key" ON "Term"("academicCalendarId", "name");

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_academicCalendarId_fkey" FOREIGN KEY ("academicCalendarId") REFERENCES "AcademicCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_academicCalendarId_fkey" FOREIGN KEY ("academicCalendarId") REFERENCES "AcademicCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_academicCalendarId_fkey" FOREIGN KEY ("academicCalendarId") REFERENCES "AcademicCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
