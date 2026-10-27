-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'POST_SHARE');

-- AlterTable
ALTER TABLE "Message"
ADD COLUMN "type" "MessageType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN "sharedPostId" TEXT;

-- CreateIndex
CREATE INDEX "Message_sharedPostId_idx" ON "Message"("sharedPostId");

-- AddForeignKey
ALTER TABLE "Message"
ADD CONSTRAINT "Message_sharedPostId_fkey"
FOREIGN KEY ("sharedPostId") REFERENCES "Post"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
