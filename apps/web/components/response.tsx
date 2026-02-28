"use client"

import * as React from "react"

interface MessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export function Message({ role, content, timestamp }: MessageProps) {
  const isUser = role === "user"
  const displayTime =
    timestamp ??
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-4 bg-[#FAFAFA] dark:bg-black">
        <div className="w-full flex justify-end">
          <div className="inline-block max-w-[85%] rounded-2xl bg-[#E5E7EB] dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100">
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex px-4 py-4 bg-[#FAFAFA] dark:bg-black">
      <div className="flex gap-3 w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agentos-logo.png"
            alt="AgentOS"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              AgentOS
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {displayTime}
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}

