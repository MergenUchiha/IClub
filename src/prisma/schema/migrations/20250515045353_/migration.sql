/*
  Warnings:

  - The values [LESSON1PLACE1,LESSON1PLACE2,LESSON2PLACE1,LESSON2PLACE2,LESSON3PLACE1,LESSON3PLACE2] on the enum `Lesson` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Lesson_new" AS ENUM ('LESSON1', 'LESSON2', 'LESSON3');
ALTER TABLE "detail" ALTER COLUMN "lesson_number" TYPE "Lesson_new" USING ("lesson_number"::text::"Lesson_new");
ALTER TYPE "Lesson" RENAME TO "Lesson_old";
ALTER TYPE "Lesson_new" RENAME TO "Lesson";
DROP TYPE "Lesson_old";
COMMIT;
