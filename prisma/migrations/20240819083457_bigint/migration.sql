/*
  Warnings:

  - Made the column `Phonenumber` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "Phonenumber" SET NOT NULL,
ALTER COLUMN "Phonenumber" SET DATA TYPE BIGINT;
