/*
  Warnings:

  - You are about to drop the column `salesCategory` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "salesCategory";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "SalesCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSalesCategory" (
    "productId" TEXT NOT NULL,
    "salesCategoryId" TEXT NOT NULL,

    CONSTRAINT "ProductSalesCategory_pkey" PRIMARY KEY ("salesCategoryId","productId")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("categoryId","productId")
);

-- AddForeignKey
ALTER TABLE "ProductSalesCategory" ADD CONSTRAINT "ProductSalesCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSalesCategory" ADD CONSTRAINT "ProductSalesCategory_salesCategoryId_fkey" FOREIGN KEY ("salesCategoryId") REFERENCES "SalesCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
