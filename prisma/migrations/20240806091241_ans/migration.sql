/*
  Warnings:

  - Changed the type of `perishable` on the `Inventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Ans" AS ENUM ('Yes', 'No');

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "perishable",
ADD COLUMN     "perishable" "Ans" NOT NULL;
