/*
  Warnings:

  - Added the required column `department` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "department" VARCHAR(255) NOT NULL,
ADD COLUMN     "is_teacher" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "student_id" DROP NOT NULL;
