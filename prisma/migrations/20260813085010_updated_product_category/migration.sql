/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_categoryId_key" ON "ProductCategory"("categoryId");
