-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('MANAGER', 'STAFF');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "role" "EmployeeRole";
