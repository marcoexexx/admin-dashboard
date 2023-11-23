/*
  Warnings:

  - The values [Drift] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SalesCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Draft', 'Pending', 'Published');
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SalesCategory_name_key" ON "SalesCategory"("name");
