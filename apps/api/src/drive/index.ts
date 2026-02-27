import type { drive_v3 } from "googleapis";
import { google } from "googleapis";
import { createOAuth2Client } from "../config/google";
import { findUserById, updateTokens } from "../store/user.store";

export type DriveFile = drive_v3.Schema$File;

const INDEXABLE_MIME_TYPES: readonly string[] = [
  "application/vnd.google-apps.document",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
];

export async function createDriveClient(
  userId: string,
): Promise<drive_v3.Drive> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  if (!user.googleAccessToken) {
    throw new Error("User has no Google Drive access token");
  }

  const oauth2 = createOAuth2Client();
  oauth2.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken ?? undefined,
    expiry_date: user.tokenExpiry?.getTime(),
  });

  oauth2.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      await updateTokens(
        userId,
        tokens.access_token,
        tokens.refresh_token ?? undefined,
        tokens.expiry_date ?? undefined,
      );
    }
  });

  return google.drive({ version: "v3", auth: oauth2 });
}

/** Lists Drive files that can be indexed (Docs, PDFs, plain text). */
export async function listSyncableFiles(
  drive: drive_v3.Drive,
): Promise<DriveFile[]> {
  const mimeConditions = INDEXABLE_MIME_TYPES.map((m) => `mimeType='${m}'`).join(
    " or ",
  );
  const query = `(${mimeConditions}) and trashed = false`;
  const fields =
    "nextPageToken, files(id, name, mimeType, modifiedTime, md5Checksum)";
  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: query,
      fields,
      pageSize: 100,
      pageToken,
    });
    const items = res.data.files ?? [];
    allFiles.push(...items);
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return allFiles;
}

/** Export a Google Doc as plain text. */
export async function exportDocAsText(
  drive: drive_v3.Drive,
  fileId: string,
): Promise<string> {
  const res = await drive.files.export(
    { fileId, mimeType: "text/plain" },
    { responseType: "text" },
  );
  return res.data as string;
}

/** Download a file’s raw bytes. */
export async function downloadFileAsBuffer(
  drive: drive_v3.Drive,
  fileId: string,
): Promise<Buffer> {
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" },
  );
  return Buffer.from(res.data as ArrayBuffer);
}