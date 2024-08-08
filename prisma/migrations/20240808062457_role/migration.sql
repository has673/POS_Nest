-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUBADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
