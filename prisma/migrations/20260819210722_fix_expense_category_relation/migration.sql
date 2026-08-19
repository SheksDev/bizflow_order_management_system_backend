/*
  Warnings:

  - You are about to drop the column `orderId` on the `Expense` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_expenseCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_orderId_fkey";

-- DropIndex
DROP INDEX "Expense_orderId_idx";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "orderId",
ADD COLUMN     "orderNumber" TEXT;

-- CreateIndex
CREATE INDEX "Expense_orderNumber_idx" ON "Expense"("orderNumber");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
