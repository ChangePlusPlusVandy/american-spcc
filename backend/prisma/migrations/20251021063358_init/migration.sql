-- CreateEnum
CREATE TYPE "RESOURCE_TYPE" AS ENUM ('PDF', 'TXT', 'VIDEO', 'WEBPAGE', 'INTERACTIVE_QUIZ', 'OTHER');

-- CreateEnum
CREATE TYPE "HOSTING_TYPE" AS ENUM ('AWS', 'WEBPAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "CATEGORY_TYPE" AS ENUM ('KIDS_EDUCATIONAL', 'PARENTAL_EDUCATIONAL');

-- CreateTable
CREATE TABLE "Resource" (
    "resouce_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "recourse_type" "RESOURCE_TYPE" NOT NULL,
    "hosting_type" "HOSTING_TYPE" NOT NULL,
    "category_type" "CATEGORY_TYPE" NOT NULL,
    "age_range_min" INTEGER NOT NULL,
    "age_range_max" INTEGER NOT NULL,
    "time_to_read" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("resouce_id")
);

-- CreateTable
CREATE TABLE "HostedRecources" (
    "id" SERIAL NOT NULL,
    "s3_key" BIGINT NOT NULL,

    CONSTRAINT "HostedRecources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HostedRecources" ADD CONSTRAINT "HostedRecources_id_fkey" FOREIGN KEY ("id") REFERENCES "Resource"("resouce_id") ON DELETE CASCADE ON UPDATE CASCADE;
