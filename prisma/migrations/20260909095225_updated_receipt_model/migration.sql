/*
  Warnings:

  - Added the required column `amount` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Receipt_receiptNumber_idx";

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "receiptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Receipt_paymentId_idx" ON "Receipt"("paymentId");
