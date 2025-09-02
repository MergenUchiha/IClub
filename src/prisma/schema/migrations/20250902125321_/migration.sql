/*
  Warnings:

  - Added the required column `teachers_department` to the `detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "status" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "detail" ADD COLUMN     "teachers_department" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_banned" BOOLEAN NOT NULL DEFAULT false;
