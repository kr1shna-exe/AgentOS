import { db, type DriveFile } from "@repo/database";

export interface UpsertDriveFileParams {
  userId: string;
  driveFileId: string;
  name: string;
  mimeType?: string;
  contentHash?: string;
  modifiedTime?: Date;
  lastSyncedAt?: Date;
}

export async function upsertDriveFile(
  params: UpsertDriveFileParams,
): Promise<DriveFile> {
  const {
    userId,
    driveFileId,
    name,
    mimeType,
    contentHash,
    modifiedTime,
    lastSyncedAt = new Date(),
  } = params;

  return db.driveFile.upsert({
    where: { userId_driveFileId: { userId, driveFileId } },
    create: {
      userId,
      driveFileId,
      name,
      mimeType,
      contentHash,
      modifiedTime,
      lastSyncedAt,
    },
    update: {
      name,
      mimeType,
      contentHash,
      modifiedTime,
      lastSyncedAt,
    },
  });
}

export async function findDriveFile(
  userId: string,
  driveFileId: string,
): Promise<DriveFile | null> {
  return db.driveFile.findUnique({
    where: { userId_driveFileId: { userId, driveFileId } },
  });
}

export async function listDriveFiles(userId: string): Promise<DriveFile[]> {
  return db.driveFile.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function deleteDriveFile(
  userId: string,
  driveFileId: string,
): Promise<void> {
  await db.driveFile.delete({
    where: { userId_driveFileId: { userId, driveFileId } },
  });
}