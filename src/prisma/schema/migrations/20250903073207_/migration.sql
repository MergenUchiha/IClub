/*
  Warnings:

  - You are about to drop the column `lesson` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `tv` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `detail` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `detail` table. All the data in the column will be lost.
  - You are about to drop the column `lesson_number` on the `detail` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `detail` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `detail` table. All the data in the column will be lost.
  - You are about to drop the column `teachers_department` on the `detail` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `detail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `lesson` on the `detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_user_id_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "lesson",
DROP COLUMN "tv",
DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "detail" DROP COLUMN "department",
DROP COLUMN "group",
DROP COLUMN "lesson_number",
DROP COLUMN "phone_number",
DROP COLUMN "teacher",
DROP COLUMN "teachers_department",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "lesson",
ADD COLUMN     "lesson" "Lesson" NOT NULL;

-- AddForeignKey
ALTER TABLE "detail" ADD CONSTRAINT "detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail" ADD CONSTRAINT "detail_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
