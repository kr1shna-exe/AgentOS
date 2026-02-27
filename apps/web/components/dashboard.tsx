"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CategoryButtons } from "./categoryButton"
import { SuggestedQuestions } from "./suggested-questions"
import { ChatInput } from "./chatInput"
import { Header } from "./header"

export function Dashboard() {
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId)
  }

  const handleQuestionClick = (question: string) => {
    const newChatId = Date.now().toString()
    router.push(`/chat/${newChatId}?q=${encodeURIComponent(question)}`)
  }

  const handleSendMessage = (message: string) => {
    const newChatId = Date.now().toString()
    router.push(`/chat/${newChatId}?q=${encodeURIComponent(message)}`)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with icons */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32 pt-16">
        <div className="w-full max-w-2xl space-y-10">
          {/* Heading */}
          <div className="text-center space-y-6">
            <h1 className="text-[32px] font-semibold text-gray-900 dark:text-white">
              How can I help you?
            </h1>
            <CategoryButtons onCategoryClick={handleCategoryClick} />
          </div>

          {/* Suggested Questions */}
          <SuggestedQuestions onQuestionClick={handleQuestionClick} />
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
