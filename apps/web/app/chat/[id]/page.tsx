"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarProvider, useSidebar } from "@/components/sidebar/sidebarContext"
import { Sidebar } from "@/components/sidebar/sidebarMain"
import { ChatContainer } from "@/components/chat/chatContainer"
import { useChat } from "@/hooks/useChat"

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isOpen } = useSidebar()
  const initialQuestion = searchParams.get("q")

  const { messages, isLoading, sendMessage } = useChat()

  React.useEffect(() => {
    if (initialQuestion && messages.length === 0) {
      sendMessage(initialQuestion)
    }
  }, [initialQuestion, messages.length, sendMessage])

  const handleLoginClick = () => router.push("/login")
  const handleNewChat = () => router.push(`/chat/${Date.now()}`)

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-black">
      <Sidebar onLoginClick={handleLoginClick} onNewChat={handleNewChat} />
      <main className={isOpen ? "flex-1 lg:ml-64" : "flex-1 ml-0"}>
        <ChatContainer
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          sidebarOpen={isOpen}
        />
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <SidebarProvider>
      <ChatPageContent />
    </SidebarProvider>
  )
}
