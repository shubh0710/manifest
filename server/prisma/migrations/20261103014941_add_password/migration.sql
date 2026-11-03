/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Case` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Case_one_active_per_company";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Case_one_active_per_company" ON "Case"("companyId") WHERE (status IN ('new', 'open'));
