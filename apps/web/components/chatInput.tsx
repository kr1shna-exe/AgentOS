"use client"

import * as React from "react"
import { CornerRightUp } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface ChatInputProps {
  onSend?: (message: string) => void
  placeholder?: string
}

export function ChatInput({ onSend, placeholder = "Type your message here..." }: ChatInputProps) {
  const [message, setMessage] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSend) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <div className="bg-[#FAFAFA] dark:bg-black w-full">
      <div className="max-w-3xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none min-w-0"
            />
            <Button
              type="submit"
              size="icon-sm"
              className="bg-[#FE7A00] hover:bg-[#E56D00] text-white rounded-lg shrink-0"
            >
              <CornerRightUp className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
