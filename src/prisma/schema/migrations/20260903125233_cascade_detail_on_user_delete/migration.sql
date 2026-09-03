-- DropForeignKey
ALTER TABLE "detail" DROP CONSTRAINT "detail_user_id_fkey";

-- AddForeignKey
ALTER TABLE "detail" ADD CONSTRAINT "detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
