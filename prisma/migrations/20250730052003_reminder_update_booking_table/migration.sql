/*
  Warnings:

  - You are about to drop the `Availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exception` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scheduledAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Availability";

-- DropTable
DROP TABLE "public"."Exception";
