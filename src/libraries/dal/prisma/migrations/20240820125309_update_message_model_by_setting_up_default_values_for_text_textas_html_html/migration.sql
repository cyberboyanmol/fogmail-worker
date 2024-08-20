/*
  Warnings:

  - Made the column `text` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `textAsHtml` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `html` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "text" SET DEFAULT '',
ALTER COLUMN "textAsHtml" SET NOT NULL,
ALTER COLUMN "textAsHtml" SET DEFAULT '',
ALTER COLUMN "html" SET NOT NULL,
ALTER COLUMN "html" SET DEFAULT '';
