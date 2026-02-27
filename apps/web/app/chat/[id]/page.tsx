"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar/sidebarMain"
import { ChatContainer } from "@/components/chat/chatContainer"
import { useChat } from "@/hooks/useChat"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuestion = searchParams.get("q")

  const { messages, isLoading, sendMessage } = useChat()

  React.useEffect(() => {
    if (initialQuestion && messages.length === 0) {
      sendMessage(initialQuestion)
    }
  }, [initialQuestion, messages.length, sendMessage])

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleNewChat = () => {
    const newChatId = Date.now().toString()
    router.push(`/chat/${newChatId}`)
  }

  const handleSendMessage = (message: string) => {
    sendMessage(message)
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-black">
      <Sidebar onLoginClick={handleLoginClick} onNewChat={handleNewChat} />
      <main className="flex-1 lg:ml-64">
        <ChatContainer 
          messages={messages} 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}
