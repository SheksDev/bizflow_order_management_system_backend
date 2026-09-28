/*
  Warnings:

  - A unique constraint covering the columns `[businessName]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Business_businessName_key" ON "Business"("businessName");
