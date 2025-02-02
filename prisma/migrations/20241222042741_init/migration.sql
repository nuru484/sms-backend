/*
  Warnings:

  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `Class` table. All the data in the column will be lost.
  - The `roomNumber` column on the `Class` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `teacherId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `dateAwarded` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `gradingType` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `admimissionStatus` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `issueDate` on the `StudentReport` table. All the data in the column will be lost.
  - You are about to drop the column `hireDate` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `salaryId` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `identityNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentPreviousSchool` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hall]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNumber]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recorderId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hall` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `examId` on table `Grade` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `relationshipToStudent` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `holderType` on the `Position` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `digitalSignature` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "employmentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'STAFF', 'PARENT');

-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('Mobile_Money', 'Bank', 'Card', 'Cash', 'Check');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "BookIssue" DROP CONSTRAINT "BookIssue_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookIssue" DROP CONSTRAINT "BookIssue_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Curriculum" DROP CONSTRAINT "Curriculum_courseId_fkey";

-- DropForeignKey
ALTER TABLE "DisciplinaryAction" DROP CONSTRAINT "DisciplinaryAction_studentId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_termId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_examId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_termId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_feeId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_saleItemId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentInstallment" DROP CONSTRAINT "PaymentInstallment_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_termId_fkey";

-- DropForeignKey
ALTER TABLE "ReportDetail" DROP CONSTRAINT "ReportDetail_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ReportDetail" DROP CONSTRAINT "ReportDetail_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "ReportDetail" DROP CONSTRAINT "ReportDetail_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportDetail" DROP CONSTRAINT "ReportDetail_termId_fkey";

-- DropForeignKey
ALTER TABLE "Restock" DROP CONSTRAINT "Restock_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_salaryId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentCourse" DROP CONSTRAINT "StudentCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentCourse" DROP CONSTRAINT "StudentCourse_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentParent" DROP CONSTRAINT "StudentParent_parentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentParent" DROP CONSTRAINT "StudentParent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentReport" DROP CONSTRAINT "StudentReport_termId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_salaryId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherClass" DROP CONSTRAINT "TeacherClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherClass" DROP CONSTRAINT "TeacherClass_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_salaryId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_driverId_fkey";

-- DropForeignKey
ALTER TABLE "identityNumber" DROP CONSTRAINT "identityNumber_userId_fkey";

-- DropIndex
DROP INDEX "Attendance_studentId_date_idx";

-- DropIndex
DROP INDEX "Grade_studentId_dateAwarded_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "studentId",
DROP COLUMN "teacherId",
ADD COLUMN     "absenceReason" TEXT,
ADD COLUMN     "category" "role" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recorderId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "remarks" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "schedule",
ADD COLUMN     "hall" VARCHAR(50) NOT NULL,
DROP COLUMN "roomNumber",
ADD COLUMN     "roomNumber" INTEGER,
ALTER COLUMN "levelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "code" VARCHAR(50) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "dateAwarded",
DROP COLUMN "gradingType",
DROP COLUMN "termId",
ALTER COLUMN "examId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "phoneNumber",
ADD COLUMN     "relationshipToStudent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "description",
ALTER COLUMN "studentId" DROP NOT NULL,
ALTER COLUMN "feeId" DROP NOT NULL,
ALTER COLUMN "saleItemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "staffId",
DROP COLUMN "studentId",
DROP COLUMN "teacherId",
DROP COLUMN "termId",
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "holderType",
ADD COLUMN     "holderType" "role" NOT NULL;

-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "frequency",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "admimissionStatus",
DROP COLUMN "dateOfBirth",
ADD COLUMN     "admissionStatus" "admissionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "StudentReport" DROP COLUMN "issueDate";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "hireDate",
DROP COLUMN "salaryId",
ADD COLUMN     "digitalSignature" TEXT NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "socialMediaHandles" JSONB,
ADD COLUMN     "spokenLanguages" TEXT[];

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "details",
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "payerAccountNumber" TEXT,
ADD COLUMN     "paymentMethod" "paymentMethod" NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "transactionDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "employmentType" "employmentType",
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phoneNumber" VARCHAR(15),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "role" "role" NOT NULL,
ADD COLUMN     "username" VARCHAR(255) NOT NULL,
ALTER COLUMN "profilePhoto" DROP NOT NULL;

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Staff";

-- DropTable
DROP TABLE "StudentCourse";

-- DropTable
DROP TABLE "StudentParent";

-- DropTable
DROP TABLE "TeacherClass";

-- DropTable
DROP TABLE "TeacherCourse";

-- DropTable
DROP TABLE "identityNumber";

-- DropTable
DROP TABLE "studentPreviousSchool";

-- CreateTable
CREATE TABLE "StudentApplicationNumber" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "taken" BOOLEAN,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "StudentApplicationNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherStaff" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "salaryId" INTEGER NOT NULL,

    CONSTRAINT "OtherStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endtDate" TIMESTAMP(3) NOT NULL,
    "department" TEXT,
    "company" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationalBackground" (
    "id" SERIAL NOT NULL,
    "degree" TEXT NOT NULL,
    "courseOfStudy" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "specialization" TEXT,
    "certifications" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EducationalBackground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthAndSafety" (
    "id" SERIAL NOT NULL,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "healthInsuranceProvider" TEXT,
    "healthInsurancePolicyNumber" TEXT,
    "comments" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "HealthAndSafety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceAndEvaluation" (
    "id" SERIAL NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL,
    "performanceScore" INTEGER NOT NULL,
    "feedback" TEXT,
    "evaluationPeriod" TEXT,
    "criteria" TEXT[],
    "userId" INTEGER NOT NULL,
    "evaluatorId" INTEGER NOT NULL,

    CONSTRAINT "PerformanceAndEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAccountDetails" (
    "id" SERIAL NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountNumber" TIMESTAMP(3) NOT NULL,
    "nameOnAccount" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StaffAccountDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "momoUser" (
    "id" SERIAL NOT NULL,
    "referenceId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,

    CONSTRAINT "momoUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileMoneyTransaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "partyIdType" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "payerMessage" TEXT,
    "payeeNote" TEXT,
    "financialTransactionId" TEXT,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "referenceId" TEXT,
    "transactionId" INTEGER,

    CONSTRAINT "MobileMoneyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBehavior" (
    "id" SERIAL NOT NULL,
    "behaviorDate" TIMESTAMP(3) NOT NULL,
    "behaviorType" TEXT,
    "description" TEXT NOT NULL,
    "disciplinaryActionId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "StudentBehavior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtracurricularActivity" (
    "id" SERIAL NOT NULL,
    "activityName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "position" TEXT,
    "description" TEXT,
    "achievements" JSONB,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ExtracurricularActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormerSchool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contactNumber" TEXT,
    "email" TEXT,
    "schoolType" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "reasonForLeaving" TEXT,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "FormerSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicPerformance" (
    "id" SERIAL NOT NULL,
    "previousGrade" TEXT,
    "promotionStatus" TEXT,
    "courses" JSONB,
    "grades" JSONB,
    "classRanking" TEXT,
    "specialPrograms" JSONB,
    "formerSchoolId" INTEGER NOT NULL,

    CONSTRAINT "AcademicPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorAndExtracurricular" (
    "id" SERIAL NOT NULL,
    "behaviorRecord" TEXT,
    "disciplinaryActions" TEXT,
    "extracurriculars" JSONB,
    "achievements" JSONB,
    "formerSchoolId" INTEGER NOT NULL,

    CONSTRAINT "BehaviorAndExtracurricular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrativeDetails" (
    "id" SERIAL NOT NULL,
    "transferCertificate" TEXT,
    "recommendationLetter" TEXT,
    "feesCleared" BOOLEAN NOT NULL DEFAULT false,
    "formerSchoolId" INTEGER NOT NULL,

    CONSTRAINT "AdministrativeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthAndSupport" (
    "id" SERIAL NOT NULL,
    "healthRecords" JSONB,
    "specialNeeds" TEXT,
    "formerSchoolId" INTEGER NOT NULL,

    CONSTRAINT "HealthAndSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentToTrip" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentParents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplicationNumber_number_key" ON "StudentApplicationNumber"("number");

-- CreateIndex
CREATE UNIQUE INDEX "OtherStaff_userId_key" ON "OtherStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileMoneyTransaction_externalId_key" ON "MobileMoneyTransaction"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileMoneyTransaction_financialTransactionId_key" ON "MobileMoneyTransaction"("financialTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileMoneyTransaction_accessToken_key" ON "MobileMoneyTransaction"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "MobileMoneyTransaction_referenceId_key" ON "MobileMoneyTransaction"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "FormerSchool_name_key" ON "FormerSchool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToTrip_AB_unique" ON "_StudentToTrip"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToTrip_B_index" ON "_StudentToTrip"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentParents_AB_unique" ON "_StudentParents"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentParents_B_index" ON "_StudentParents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentCourses_AB_unique" ON "_StudentCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentCourses_B_index" ON "_StudentCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherCourses_AB_unique" ON "_TeacherCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherCourses_B_index" ON "_TeacherCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherClass_AB_unique" ON "_TeacherClass"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherClass_B_index" ON "_TeacherClass"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassCourses_AB_unique" ON "_ClassCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassCourses_B_index" ON "_ClassCourses"("B");

-- CreateIndex
CREATE INDEX "Attendance_userId_date_idx" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Class_hall_key" ON "Class"("hall");

-- CreateIndex
CREATE UNIQUE INDEX "Class_roomNumber_key" ON "Class"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Level_name_key" ON "Level"("name");

-- CreateIndex
CREATE INDEX "Position_title_holderType_idx" ON "Position"("title", "holderType");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- AddForeignKey
ALTER TABLE "StudentApplicationNumber" ADD CONSTRAINT "StudentApplicationNumber_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherStaff" ADD CONSTRAINT "OtherStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationalBackground" ADD CONSTRAINT "EducationalBackground_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthAndSafety" ADD CONSTRAINT "HealthAndSafety_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceAndEvaluation" ADD CONSTRAINT "PerformanceAndEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceAndEvaluation" ADD CONSTRAINT "PerformanceAndEvaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentReport" ADD CONSTRAINT "StudentReport_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetail" ADD CONSTRAINT "ReportDetail_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetail" ADD CONSTRAINT "ReportDetail_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetail" ADD CONSTRAINT "ReportDetail_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetail" ADD CONSTRAINT "ReportDetail_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "StudentReport"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_recorderId_fkey" FOREIGN KEY ("recorderId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "Fee"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "SaleItem"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInstallment" ADD CONSTRAINT "PaymentInstallment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAccountDetails" ADD CONSTRAINT "StaffAccountDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileMoneyTransaction" ADD CONSTRAINT "MobileMoneyTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restock" ADD CONSTRAINT "Restock_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BookCategory"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryAction" ADD CONSTRAINT "DisciplinaryAction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBehavior" ADD CONSTRAINT "StudentBehavior_disciplinaryActionId_fkey" FOREIGN KEY ("disciplinaryActionId") REFERENCES "DisciplinaryAction"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBehavior" ADD CONSTRAINT "StudentBehavior_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBehavior" ADD CONSTRAINT "StudentBehavior_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtracurricularActivity" ADD CONSTRAINT "ExtracurricularActivity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "OtherStaff"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormerSchool" ADD CONSTRAINT "FormerSchool_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicPerformance" ADD CONSTRAINT "AcademicPerformance_formerSchoolId_fkey" FOREIGN KEY ("formerSchoolId") REFERENCES "FormerSchool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorAndExtracurricular" ADD CONSTRAINT "BehaviorAndExtracurricular_formerSchoolId_fkey" FOREIGN KEY ("formerSchoolId") REFERENCES "FormerSchool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeDetails" ADD CONSTRAINT "AdministrativeDetails_formerSchoolId_fkey" FOREIGN KEY ("formerSchoolId") REFERENCES "FormerSchool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthAndSupport" ADD CONSTRAINT "HealthAndSupport_formerSchoolId_fkey" FOREIGN KEY ("formerSchoolId") REFERENCES "FormerSchool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToTrip" ADD CONSTRAINT "_StudentToTrip_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToTrip" ADD CONSTRAINT "_StudentToTrip_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentParents" ADD CONSTRAINT "_StudentParents_A_fkey" FOREIGN KEY ("A") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentParents" ADD CONSTRAINT "_StudentParents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentCourses" ADD CONSTRAINT "_StudentCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentCourses" ADD CONSTRAINT "_StudentCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherClass" ADD CONSTRAINT "_TeacherClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherClass" ADD CONSTRAINT "_TeacherClass_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCourses" ADD CONSTRAINT "_ClassCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCourses" ADD CONSTRAINT "_ClassCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
