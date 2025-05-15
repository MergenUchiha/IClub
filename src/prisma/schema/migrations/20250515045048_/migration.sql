/*
  Warnings:

  - You are about to alter the column `teacher` on the `detail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone_number` on the `detail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - Added the required column `department` to the `detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_number` to the `detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tv` to the `detail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `lesson` on the `detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `group` on the `detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "detail" ADD COLUMN     "department" VARCHAR(255) NOT NULL,
ADD COLUMN     "lesson_number" "Lesson" NOT NULL,
ADD COLUMN     "tv" BOOLEAN NOT NULL,
DROP COLUMN "lesson",
ADD COLUMN     "lesson" VARCHAR(255) NOT NULL,
DROP COLUMN "group",
ADD COLUMN     "group" INTEGER NOT NULL,
ALTER COLUMN "teacher" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(12);
