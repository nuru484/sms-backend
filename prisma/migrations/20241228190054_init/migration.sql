/*
  Warnings:

  - You are about to drop the column `taken` on the `StudentApplicationNumber` table. All the data in the column will be lost.
  - You are about to drop the `_StudentToTrip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentToTrip" DROP CONSTRAINT "_StudentToTrip_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToTrip" DROP CONSTRAINT "_StudentToTrip_B_fkey";

-- AlterTable
ALTER TABLE "StudentApplicationNumber" DROP COLUMN "taken",
ADD COLUMN     "isSold" BOOLEAN,
ADD COLUMN     "isUsed" BOOLEAN;

-- DropTable
DROP TABLE "_StudentToTrip";
