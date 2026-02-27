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

export async function upsertDriveFile( params: UpsertDriveFileParams ) {
  const {
    userId,
    driveFileId,
    name,
    mimeType,
    contentHash,
    modifiedTime,
    lastSyncedAt = new Date(),
  } = params;

  type CreateInput = Parameters<typeof db.driveFile.upsert>[0]["create"];
  type UpdateInput = Parameters<typeof db.driveFile.upsert>[0]["update"];

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
    } as CreateInput,
    update: {
      name,
      mimeType,
      contentHash,
      modifiedTime,
      lastSyncedAt,
    } as UpdateInput,
  });
}

export async function findDriveFile( userId: string, driveFileId: string ) {
  return db.driveFile.findUnique({
    where: { 
        userId_driveFileId: { 
            userId, driveFileId 
        } 
    },
  });
}

export async function listDriveFiles(userId: string) {
  return db.driveFile.findMany({
    where: { 
        userId 
    },
    orderBy: { 
        name: "asc" 
    },
  });
}

export async function deleteDriveFile( userId: string, driveFileId: string ) {
  await db.driveFile.delete({
    where: { 
        userId_driveFileId: { 
            userId, 
            driveFileId 
        } 
    },
  });
}