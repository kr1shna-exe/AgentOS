"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { ChatInput } from "./chatInput"
import { Header } from "./header"
import { useSidebar } from "./sidebar/sidebarContext"

export function Dashboard() {
  const router = useRouter()
  const { isOpen } = useSidebar()

  const handleSendMessage = (message: string) => {
    router.push(`/chat/${Date.now()}?q=${encodeURIComponent(message)}`)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header sidebarOpen={isOpen} />
      {/* Empty content area - chat input at bottom center */}
      <div className="flex-1 min-h-0" />
      {/* Chat input fixed at bottom center */}
      <div
        className={cn(
          "fixed bottom-0 right-0 transition-[left] duration-300",
          isOpen ? "left-64" : "left-0"
        )}
      >
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
