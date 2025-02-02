/*
  Warnings:

  - You are about to drop the column `reportId` on the `ReportDetail` table. All the data in the column will be lost.
  - You are about to drop the `StudentReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeacherClass` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `behavior` to the `StudentBehavior` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReportDetail" DROP CONSTRAINT "ReportDetail_reportId_fkey";

-- DropForeignKey
ALTER TABLE "StudentReport" DROP CONSTRAINT "StudentReport_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentReport" DROP CONSTRAINT "StudentReport_termId_fkey";

-- DropForeignKey
ALTER TABLE "_TeacherClass" DROP CONSTRAINT "_TeacherClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeacherClass" DROP CONSTRAINT "_TeacherClass_B_fkey";

-- DropIndex
DROP INDEX "ReportDetail_reportId_courseId_key";

-- AlterTable
ALTER TABLE "ReportDetail" DROP COLUMN "reportId";

-- AlterTable
ALTER TABLE "StudentBehavior" ADD COLUMN     "behavior" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "StudentReport";

-- DropTable
DROP TABLE "_TeacherClass";

-- CreateTable
CREATE TABLE "LessonTimetable" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonTimetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "timetable_unique_schedule" ON "LessonTimetable"("dayOfWeek", "startTime", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToUser_AB_unique" ON "_ClassToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToUser_B_index" ON "_ClassToUser"("B");

-- AddForeignKey
ALTER TABLE "LessonTimetable" ADD CONSTRAINT "LessonTimetable_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTimetable" ADD CONSTRAINT "LessonTimetable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTimetable" ADD CONSTRAINT "LessonTimetable_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTimetable" ADD CONSTRAINT "LessonTimetable_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToUser" ADD CONSTRAINT "_ClassToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToUser" ADD CONSTRAINT "_ClassToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
