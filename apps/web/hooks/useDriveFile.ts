"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, streamPost } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { DriveFile, SyncEvent } from "@/lib/types";

export function useDriveFiles() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!isAuthenticated()) {
      setFiles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ success: boolean; data: DriveFile[] }>(
        "/drive/files"
      );
      setFiles(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const onAuthChange = () => void fetchFiles();
    window.addEventListener("auth-change", onAuthChange);
    return () => window.removeEventListener("auth-change", onAuthChange);
  }, [fetchFiles]);

  return { files, loading, error, refresh: fetchFiles };
}

export type SyncMode = "full" | "incremental";
export type SyncStatus = "idle" | "syncing" | "done" | "error";

export function useDriveSync() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const sync = useCallback(async (mode: SyncMode, onDone?: () => void) => {
    setStatus("syncing");
    setEvents([]);
    abortRef.current = new AbortController();

    try {
      const reader = await streamPost(
        "/drive/sync",
        { mode },
        abortRef.current.signal
      );

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw) as SyncEvent;
            setEvents((prev) => [...prev, event]);
            if (event.type === "completed") {
              setStatus("done");
              onDone?.();
            } else if (event.type === "error") {
              setStatus("error");
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus("error");
      setEvents((prev) => [
        ...prev,
        {
          type: "error",
          error: err instanceof Error ? err.message : "Sync failed",
        },
      ]);
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, []);

  return { status, events, sync, cancel };
}
