/*
  Warnings:

  - A unique constraint covering the columns `[studentApplicationNumberId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentApplicationNumberId_key" ON "Student"("studentApplicationNumberId");
