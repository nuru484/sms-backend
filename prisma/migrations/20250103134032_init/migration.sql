/*
  Warnings:

  - The `notificationChannel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "subject" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationChannel",
ADD COLUMN     "notificationChannel" TEXT NOT NULL DEFAULT 'SMS';
