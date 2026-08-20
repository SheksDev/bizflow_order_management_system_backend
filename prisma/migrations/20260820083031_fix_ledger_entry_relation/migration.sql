/*
  Warnings:

  - You are about to drop the column `orderId` on the `LedgerEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_orderId_fkey";

-- AlterTable
ALTER TABLE "LedgerEntry" DROP COLUMN "orderId",
ADD COLUMN     "orderNumber" TEXT;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNumber") ON DELETE SET NULL ON UPDATE CASCADE;
