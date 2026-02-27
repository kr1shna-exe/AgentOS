"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ChatItem {
  id: string
  title: string
  timestamp: string
}

export function ChatHistory() {
  const router = useRouter()
  const pathname = usePathname()

  // Mock data - replace with actual data from your backend
  const chats: ChatItem[] = [
    {
      id: "1",
      title: "Vector Embeddings Intro",
      timestamp: "Last 7 Days",
    },
  ]

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  return (
    <div className="px-4 py-2">
      <div className="mb-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3">
          Last 7 Days
        </h3>
      </div>
      <div className="space-y-0.5">
        {chats.map((chat) => {
          const isActive = pathname === `/chat/${chat.id}`
          return (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left",
                "hover:bg-white dark:hover:bg-gray-800 transition-colors",
                isActive
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              <span className="truncate">{chat.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
