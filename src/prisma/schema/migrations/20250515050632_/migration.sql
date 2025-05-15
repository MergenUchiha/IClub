-- AlterTable
ALTER TABLE "detail" ALTER COLUMN "tv" SET DEFAULT false;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "order_number" SERIAL NOT NULL;
