/*
  Warnings:

  - Added the required column `updatedAt` to the `AgentRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentRun" ADD COLUMN     "maxSteps" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
