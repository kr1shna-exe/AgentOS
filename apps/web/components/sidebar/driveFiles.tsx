"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { useDriveFiles, useDriveSync } from "@/hooks/useDriveFile"
import { isAuthenticated } from "@/lib/auth"
import { cn } from "@workspace/ui/lib/utils"

export function DriveFiles() {
  const { files, loading, refresh } = useDriveFiles()
  const { status: syncStatus, sync } = useDriveSync()
  const [auth, setAuth] = React.useState(false)

  React.useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  React.useEffect(() => {
    const onAuthChange = () => setAuth(isAuthenticated())
    window.addEventListener("auth-change", onAuthChange)
    return () => window.removeEventListener("auth-change", onAuthChange)
  }, [])

  const handleLoadFiles = () => {
    if (auth) {
      sync("full", () => refresh())
    }
  }

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        DRIVE FILES
      </h3>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "w-full justify-center h-9 rounded-lg",
          "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        onClick={handleLoadFiles}
        disabled={!auth || syncStatus === "syncing"}
      >
        {syncStatus === "syncing" ? "Syncing..." : "Load Files"}
      </Button>
      {!auth ? (
        <p className="mt-2 text-xs text-purple-500 dark:text-purple-400">
          Connect Google Drive first.
        </p>
      ) : files.length > 0 ? (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {files.length} file{files.length !== 1 ? "s" : ""} loaded
        </p>
      ) : null}
    </div>
  )
}
