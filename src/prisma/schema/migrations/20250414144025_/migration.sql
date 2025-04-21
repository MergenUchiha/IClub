-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "refresh_token" VARCHAR(500) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);
