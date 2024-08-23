/*
  Warnings:

  - The `paxNumber` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "paxNumber",
ADD COLUMN     "paxNumber" INTEGER;
