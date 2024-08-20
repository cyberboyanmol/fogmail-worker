/*
  Warnings:

  - You are about to drop the column `emailusername` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the `EmailInbox` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_emailusername_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropIndex
DROP INDEX "Conversation_emailusername_idx";

-- DropIndex
DROP INDEX "Message_conversationId_date_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "emailusername",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "EmailInbox";

-- CreateTable
CREATE TABLE "Inbox" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inbox_username_key" ON "Inbox"("username");

-- CreateIndex
CREATE INDEX "Inbox_username_idx" ON "Inbox"("username");

-- CreateIndex
CREATE INDEX "Conversation_username_idx" ON "Conversation"("username");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_username_fkey" FOREIGN KEY ("username") REFERENCES "Inbox"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
