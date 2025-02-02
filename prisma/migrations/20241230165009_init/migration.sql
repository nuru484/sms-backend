/*
  Warnings:

  - You are about to drop the column `date` on the `DisciplinaryAction` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `DisciplinaryAction` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `DisciplinaryAction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `DisciplinaryAction` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `DisciplinaryAction` table. All the data in the column will be lost.
  - You are about to drop the column `behavior` on the `StudentBehavior` table. All the data in the column will be lost.
  - You are about to drop the `_DisciplinaryActionToStudentBehavior` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `DisciplinaryAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `behaviorId` to the `StudentBehavior` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DisciplinaryAction" DROP CONSTRAINT "DisciplinaryAction_studentId_fkey";

-- DropForeignKey
ALTER TABLE "_DisciplinaryActionToStudentBehavior" DROP CONSTRAINT "_DisciplinaryActionToStudentBehavior_A_fkey";

-- DropForeignKey
ALTER TABLE "_DisciplinaryActionToStudentBehavior" DROP CONSTRAINT "_DisciplinaryActionToStudentBehavior_B_fkey";

-- AlterTable
ALTER TABLE "DisciplinaryAction" DROP COLUMN "date",
DROP COLUMN "reason",
DROP COLUMN "remarks",
DROP COLUMN "status",
DROP COLUMN "studentId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentBehavior" DROP COLUMN "behavior",
ADD COLUMN     "behaviorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_DisciplinaryActionToStudentBehavior";

-- CreateTable
CREATE TABLE "Behavior" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Behavior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDisciplinaryAction" (
    "id" SERIAL NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "remarks" TEXT,
    "studentId" INTEGER NOT NULL,
    "disciplinaryActionId" INTEGER NOT NULL,

    CONSTRAINT "StudentDisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentBehavior" ADD CONSTRAINT "StudentBehavior_behaviorId_fkey" FOREIGN KEY ("behaviorId") REFERENCES "Behavior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDisciplinaryAction" ADD CONSTRAINT "StudentDisciplinaryAction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDisciplinaryAction" ADD CONSTRAINT "StudentDisciplinaryAction_disciplinaryActionId_fkey" FOREIGN KEY ("disciplinaryActionId") REFERENCES "DisciplinaryAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
