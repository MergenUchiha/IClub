/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_product_id_key" ON "images"("product_id");
