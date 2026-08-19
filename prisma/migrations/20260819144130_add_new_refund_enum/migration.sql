-- CreateEnum
CREATE TYPE "RefundType" AS ENUM ('PAYMENT', 'TIP');

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN     "refundType" "RefundType" NOT NULL DEFAULT 'PAYMENT';
