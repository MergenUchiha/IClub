/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "admin_id" UUID,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_admin_id_key" ON "tokens"("admin_id");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
