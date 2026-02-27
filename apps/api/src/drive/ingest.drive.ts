import { createHash } from "node:crypto";
import { createDriveClient, listSyncableFiles } from "./index";
import { extractContent } from "./extract.drive";
import { findDriveFile, upsertDriveFile } from "../store/drive.store";
import { chunkText, embedChunks } from "../utils/embedding";
import {
  ensureVectorCollection,
  deleteFileChunks,
  upsertFileChunks,
} from "../store/vector.store";

export type SyncMode = "full" | "incremental";

export type SyncEvent =
  | { type: "started"; totalFiles: number }
  | { type: "file_processing"; fileName: string; fileId: string }
  | {
      type: "file_completed";
      fileName: string;
      fileId: string;
      processedFiles: number;
      skippedFiles: number;
    }
  | { type: "file_skipped"; fileName: string; fileId: string }
  | { type: "file_error"; fileName: string; fileId: string; error: string }
  | {
      type: "completed";
      totalFiles: number;
      processedFiles: number;
      skippedFiles: number;
    }
  | { type: "error"; error: string };

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export async function* syncDrive(
  userId: string,
  mode: SyncMode,
): AsyncGenerator<SyncEvent> {
  try {
    await ensureVectorCollection();
    const drive = await createDriveClient(userId);
    const files = await listSyncableFiles(drive);

    yield { type: "started", totalFiles: files.length };

    let processed = 0;
    let skipped = 0;

    for (const file of files) {
      const driveFileId = file.id;
      const name = file.name ?? "unknown";
      const mimeType = file.mimeType ?? undefined;
      const modifiedTime = file.modifiedTime
        ? new Date(file.modifiedTime)
        : undefined;

      if (!driveFileId || !file.name) continue;

      yield { type: "file_processing", fileName: name, fileId: driveFileId };

      const existing =
        mode === "incremental"
          ? await findDriveFile(userId, driveFileId)
          : null;

      const existingLastSynced = (existing as { lastSyncedAt?: Date } | null)
        ?.lastSyncedAt;
      if (
        mode === "incremental" &&
        existingLastSynced &&
        modifiedTime &&
        modifiedTime <= existingLastSynced
      ) {
        skipped++;
        yield { type: "file_skipped", fileName: name, fileId: driveFileId };
        continue;
      }

      try {
        const rawContent = await extractContent(drive, file);
        if (!rawContent || rawContent.trim().length === 0) {
          skipped++;
          yield { type: "file_skipped", fileName: name, fileId: driveFileId };
          continue;
        }

        const fingerprint = sha256Hex(rawContent);

        const existingHash = (existing as { contentHash?: string } | null)
          ?.contentHash;
        if (mode === "incremental" && existingHash === fingerprint) {
          skipped++;
          yield { type: "file_skipped", fileName: name, fileId: driveFileId };
          continue;
        }

        await deleteFileChunks(userId, driveFileId);

        const chunks = chunkText(rawContent);
        const chunkTexts = chunks.map((c) => c.text);
        const embeddings = await embedChunks(chunkTexts);
        await upsertFileChunks(
          userId,
          driveFileId,
          name,
          chunkTexts,
          embeddings,
        );

        await upsertDriveFile({
          userId,
          driveFileId,
          name,
          mimeType,
          contentHash: fingerprint,
          modifiedTime,
          lastSyncedAt: new Date(),
        });

        processed++;
        yield {
          type: "file_completed",
          fileName: name,
          fileId: driveFileId,
          processedFiles: processed,
          skippedFiles: skipped,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[ingest] Error processing "${name}":`, err);
        yield {
          type: "file_error",
          fileName: name,
          fileId: driveFileId,
          error: message,
        };
      }
    }

    yield {
      type: "completed",
      totalFiles: files.length,
      processedFiles: processed,
      skippedFiles: skipped,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ingest] Drive sync failed:", err);
    yield { type: "error", error: message };
  }
}