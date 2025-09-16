/*
  Warnings:

  - You are about to drop the column `name` on the `department` table. All the data in the column will be lost.
  - Added the required column `title` to the `department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "department" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
