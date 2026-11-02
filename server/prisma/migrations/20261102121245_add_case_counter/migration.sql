/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Case` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Case_one_active_per_company";

-- CreateTable
CREATE TABLE "CaseCounter" (
    "year" INTEGER NOT NULL,
    "last" INTEGER NOT NULL,

    CONSTRAINT "CaseCounter_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_one_active_per_company" ON "Case"("companyId") WHERE (status IN ('new', 'open'));
