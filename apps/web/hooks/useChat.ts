"use client"

import * as React from "react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export function useChat(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)

  const sendMessage = React.useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: content }),
      // })
      // const data = await response.json()

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a placeholder response. Connect to your backend API to get real responses.",
        timestamp: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
