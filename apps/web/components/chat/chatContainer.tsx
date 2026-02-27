"use client"

import * as React from "react"
import { Message } from "../message"
import { ChatInput } from "../chatInput"
import { Header } from "../header"
import { Loading } from "../loading"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

interface ChatContainerProps {
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => void
  isLoading?: boolean
}

export function ChatContainer({ messages = [], onSendMessage, isLoading = false }: ChatContainerProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-16 pb-32">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Start a conversation...
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="px-6 py-6 bg-gray-50 dark:bg-black">
                <Loading size="sm" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64">
        <ChatInput onSend={onSendMessage} />
      </div>
    </div>
  )
}
