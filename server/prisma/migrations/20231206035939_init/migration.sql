/*
  Warnings:

  - Added the required column `platform` to the `AccessLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessLog" ADD COLUMN     "platform" TEXT NOT NULL;
