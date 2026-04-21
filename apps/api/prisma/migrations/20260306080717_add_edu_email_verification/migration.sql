/*
  Warnings:

  - A unique constraint covering the columns `[verificationTokenHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationTokenHash_key" ON "User"("verificationTokenHash");
