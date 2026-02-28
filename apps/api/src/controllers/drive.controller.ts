import type { Response } from "express";
import { listDriveFiles } from "../store/drive.store";
import { syncDrive as runDriveSync } from "../drive/ingest.drive";
import type { AuthRequest } from "../middleware/auth.middleware";

export const syncDrive = async (req: AuthRequest, res: Response) => {
  const emit = (event: object) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Keepalive ping every 20s to prevent proxy idle-timeout from killing the stream
  const keepalive = setInterval(() => {
    res.write(": ping\n\n");
  }, 20_000);

  try {
    const userId = req.user!.userId;
    const mode = req.body.mode === "incremental" ? "incremental" : "full";

    for await (const syncEvent of runDriveSync(userId, mode)) {
      emit(syncEvent);
      if (syncEvent.type === "completed" || syncEvent.type === "error") break;
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Sync failed";
    emit({ type: "error", error });
  } finally {
    clearInterval(keepalive);
    res.end();
  }
};

// List all synced Drive files for the authenticated user.
export const syncedDriveFiles = async (req: AuthRequest, res: Response) => {
  try {

    const files = await listDriveFiles(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: files,
      error: null,
      });
      
  } catch (err) {
    console.error("Failed to list drive files:", err);

    res.status(500).json({
      success: false,
      message: null,
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};