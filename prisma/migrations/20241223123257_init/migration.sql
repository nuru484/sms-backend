/*
  Warnings:

  - You are about to drop the column `disciplinaryActionId` on the `StudentBehavior` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentBehavior" DROP CONSTRAINT "StudentBehavior_disciplinaryActionId_fkey";

-- AlterTable
ALTER TABLE "StudentBehavior" DROP COLUMN "disciplinaryActionId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_DisciplinaryActionToStudentBehavior" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplinaryActionToStudentBehavior_AB_unique" ON "_DisciplinaryActionToStudentBehavior"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplinaryActionToStudentBehavior_B_index" ON "_DisciplinaryActionToStudentBehavior"("B");

-- AddForeignKey
ALTER TABLE "_DisciplinaryActionToStudentBehavior" ADD CONSTRAINT "_DisciplinaryActionToStudentBehavior_A_fkey" FOREIGN KEY ("A") REFERENCES "DisciplinaryAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplinaryActionToStudentBehavior" ADD CONSTRAINT "_DisciplinaryActionToStudentBehavior_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentBehavior"("id") ON DELETE CASCADE ON UPDATE CASCADE;
