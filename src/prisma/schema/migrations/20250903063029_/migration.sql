/*
  Warnings:

  - Added the required column `user_id` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "detail" DROP CONSTRAINT "detail_booking_id_fkey";

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "tv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
