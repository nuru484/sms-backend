/*
  Warnings:

  - Added the required column `saleItemId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "examId" INTEGER;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "saleItemId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "date" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER NOT NULL,
    "teacherId" INTEGER,
    "examTypeId" INTEGER,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "objectives" VARCHAR(255) NOT NULL,
    "syllabus" TEXT,
    "resources" TEXT,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "ISBN" VARCHAR(13) NOT NULL,
    "publisher" VARCHAR(255),
    "publishedDate" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "categoryId" INTEGER,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIssue" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Issued',

    CONSTRAINT "BookIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "role" VARCHAR(50) NOT NULL,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisciplinaryAction" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" VARCHAR(255) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "remarks" VARCHAR(255),

    CONSTRAINT "DisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "driverId" INTEGER,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamType_name_key" ON "ExamType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Book_ISBN_key" ON "Book"("ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "SaleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BookCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryAction" ADD CONSTRAINT "DisciplinaryAction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
