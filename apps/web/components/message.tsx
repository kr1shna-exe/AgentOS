"use client"

import * as React from "react"
import { User, Bot } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface MessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export function Message({ role, content, timestamp }: MessageProps) {
  const isUser = role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end px-6 py-4 bg-white dark:bg-gray-900">
        <div className="max-w-2xl">
          <div className="inline-block rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100">
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-6 py-4 bg-gray-50 dark:bg-black">
      <div className="w-full max-w-3xl">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                AgentOS
              </span>
              {timestamp && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {timestamp}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
