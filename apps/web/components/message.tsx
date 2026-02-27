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

  return (
    <div
      className={cn(
        "flex gap-4 px-6 py-6",
        isUser ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-black"
      )}
    >
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {isUser ? "You" : "AgentOS"}
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
  )
}
