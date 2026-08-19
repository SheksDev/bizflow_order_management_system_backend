/*
  Warnings:

  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `orderNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropIndex
DROP INDEX "Payment_orderId_idx";

-- DropIndex
DROP INDEX "Payment_orderId_paymentDate_idx";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
ADD COLUMN     "orderNumber" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_orderNumber_idx" ON "Payment"("orderNumber");

-- CreateIndex
CREATE INDEX "Payment_orderNumber_paymentDate_idx" ON "Payment"("orderNumber", "paymentDate");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
