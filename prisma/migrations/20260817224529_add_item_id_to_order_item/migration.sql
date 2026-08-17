/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "itemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_itemId_key" ON "OrderItem"("itemId");
