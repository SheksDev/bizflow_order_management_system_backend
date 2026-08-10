/*
  Warnings:

  - The primary key for the `Counter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `Counter` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Counter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CounterName" AS ENUM ('USER', 'CUSTOMER', 'PRODUCT', 'ORDER');

-- AlterTable
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "CounterName" NOT NULL,
ADD CONSTRAINT "Counter_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Counter_name_key" ON "Counter"("name");
