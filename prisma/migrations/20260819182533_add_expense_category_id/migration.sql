/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `ExpenseCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `ExpenseCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseCategory" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_categoryId_key" ON "ExpenseCategory"("categoryId");
