-- AlterTable
ALTER TABLE "DriveFile" ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);
