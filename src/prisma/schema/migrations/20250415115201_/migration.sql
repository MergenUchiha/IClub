/*
  Warnings:

  - Made the column `contacts` on table `shop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shop" ALTER COLUMN "contacts" SET NOT NULL;
