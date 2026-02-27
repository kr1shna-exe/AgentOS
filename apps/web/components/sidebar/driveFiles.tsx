"use client"

import * as React from "react"
import { FileText, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useDriveFiles, useDriveSync } from "@/hooks/useDriveFile"
import { isAuthenticated } from "@/lib/auth"
import { cn } from "@workspace/ui/lib/utils"

const MIME_LABELS: Record<string, string> = {
  "application/vnd.google-apps.document": "Google Doc",
  "application/pdf": "PDF",
  "text/plain": "Text",
}

function mimeLabel(mime: string | null) {
  if (!mime) return "File"
  return MIME_LABELS[mime] ?? mime.split("/").pop() ?? "File"
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function DriveFiles() {
  const { files, loading: filesLoading, refresh } = useDriveFiles()
  const { status: syncStatus, events, sync } = useDriveSync()
  const [auth, setAuth] = React.useState(false)

  React.useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  React.useEffect(() => {
    const onAuthChange = () => setAuth(isAuthenticated())
    window.addEventListener("auth-change", onAuthChange)
    return () => window.removeEventListener("auth-change", onAuthChange)
  }, [])

  React.useEffect(() => {
    if (syncStatus === "done") {
      refresh()
    }
  }, [syncStatus, refresh])

  const handleLoadFiles = () => {
    if (auth) {
      sync("full")
    }
  }

  const isSyncing = syncStatus === "syncing"

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        DRIVE FILES
      </h3>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 justify-center h-9 rounded-lg gap-1.5",
            "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          onClick={handleLoadFiles}
          disabled={!auth || isSyncing}
        >
          {isSyncing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Load Files
        </Button>
      </div>

      {!auth ? (
        <p className="mt-2 text-xs text-purple-500 dark:text-purple-400">
          Connect Google Drive first.
        </p>
      ) : (
        <>
          {/* Sync log (compact) */}
          {events.length > 0 && (
            <div className="mt-2 max-h-24 overflow-y-auto rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2 font-mono text-[10px] text-gray-600 dark:text-gray-400 space-y-0.5">
              {events.slice(-5).map((e, i) => (
                <div key={i}>
                  {e.type === "file_completed" && `✓ ${e.fileName}`}
                  {e.type === "file_processing" && `… ${e.fileName}`}
                  {e.type === "completed" && "Sync complete"}
                  {e.type === "error" && `Error: ${e.error}`}
                </div>
              ))}
            </div>
          )}

          {/* Indexed files list */}
          {filesLoading ? (
            <div className="mt-2 space-y-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
                />
              ))}
            </div>
          ) : files.length > 0 ? (
            <div className="mt-2 max-h-32 overflow-y-auto rounded border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              <div className="px-2 py-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                Indexed ({files.length})
              </div>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="px-2 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate text-xs text-gray-700 dark:text-gray-300 flex-1">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {mimeLabel(file.mimeType)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Run Load Files to index your Drive.
            </p>
          )}
        </>
      )}
    </div>
  )
}
