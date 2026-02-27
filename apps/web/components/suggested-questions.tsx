"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const suggestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
]

interface SuggestedQuestionsProps {
  onQuestionClick?: (question: string) => void
}

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {suggestions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick?.(question)}
          className={cn(
            "w-full text-left px-5 py-3.5 rounded-xl text-sm",
            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all",
            "text-gray-700 dark:text-gray-200 font-normal"
          )}
        >
          {question}
        </button>
      ))}
    </div>
  )
}
