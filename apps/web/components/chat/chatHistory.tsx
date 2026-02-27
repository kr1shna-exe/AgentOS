"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAgentRuns } from "@/hooks/useAgentRuns"
import { cn } from "@workspace/ui/lib/utils"

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return "Last 7 Days"
  if (diffDays < 30) return "Last 30 Days"
  return "Older"
}

export function ChatHistory() {
  const router = useRouter()
  const pathname = usePathname()
  const { runs, loading } = useAgentRuns()

  const grouped = React.useMemo(() => {
    const groups: Record<string, typeof runs> = {}
    for (const run of runs) {
      const key = formatRelativeTime(run.createdAt)
      if (!groups[key]) groups[key] = []
      groups[key]!.push(run)
    }
    const order = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Older"]
    return order
      .filter((k) => groups[k]?.length)
      .map((k) => ({ label: k, runs: groups[k]! }))
  }, [runs])

  const handleChatClick = (runId: string) => {
    router.push(`/chat/${runId}`)
  }

  const extractTitle = (task: string) => {
    if (!task) return "Untitled"
    return task.length > 40 ? task.slice(0, 40) + "…" : task
  }

  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      {grouped.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
          No conversations yet
        </p>
      ) : (
        grouped.map(({ label, runs: groupRuns }) => (
          <div key={label} className="mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 mb-1.5">
              {label}
            </h3>
            <div className="space-y-0.5">
              {groupRuns.map((run) => {
                const isActive =
                  pathname === `/chat/${run.id}` ||
                  pathname.startsWith(`/chat/${run.id}`)
                return (
                  <button
                    key={run.id}
                    onClick={() => handleChatClick(run.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left truncate",
                      "hover:bg-white dark:hover:bg-gray-800 transition-colors",
                      isActive
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-200"
                    )}
                  >
                    <span className="truncate flex-1">
                      {extractTitle(run.task)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
