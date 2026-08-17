/*
  Warnings:

  - The values [PRODUCT] on the enum `CounterName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CounterName_new" AS ENUM ('USER', 'CUSTOMER', 'PRODUCT_CATEGORY', 'ORDER', 'PAYMENT', 'EXPENSE', 'RECEIPT');
ALTER TABLE "Counter" ALTER COLUMN "name" TYPE "CounterName_new" USING ("name"::text::"CounterName_new");
ALTER TYPE "CounterName" RENAME TO "CounterName_old";
ALTER TYPE "CounterName_new" RENAME TO "CounterName";
DROP TYPE "public"."CounterName_old";
COMMIT;
