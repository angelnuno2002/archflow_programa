/*
  Warnings:

  - Made the column `dueDate` on table `Phase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Phase" ALTER COLUMN "dueDate" SET NOT NULL;
