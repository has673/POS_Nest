/*
  Warnings:

  - You are about to drop the column `quantity` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allowCategoryModify" BOOLEAN DEFAULT false,
ADD COLUMN     "allowReservation" BOOLEAN DEFAULT false,
ADD COLUMN     "allowStaffModify" BOOLEAN DEFAULT false;
