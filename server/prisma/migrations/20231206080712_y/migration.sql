-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "state" "OrderState" NOT NULL DEFAULT 'Pending';
