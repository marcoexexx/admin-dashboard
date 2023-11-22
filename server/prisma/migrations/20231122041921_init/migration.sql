/*
  Warnings:

  - You are about to drop the column `reviewId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_reviewId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
