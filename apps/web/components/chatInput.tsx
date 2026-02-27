"use client"

import * as React from "react"
import { CornerRightUp } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChatInputProps } from "@/types/chat.type"

const MIN_ROWS = 1
const MAX_ROWS = 8

export function ChatInput({ onSend, placeholder = "Type your message here...", maxWidthClass = "max-w-2xl" }: ChatInputProps) {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = React.useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const lineHeight = 20
    const minHeight = lineHeight * MIN_ROWS
    const maxHeight = lineHeight * MAX_ROWS
    const newHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight)
    el.style.height = `${newHeight}px`
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [message, adjustHeight])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSend) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="bg-[#FAFAFA] dark:bg-black w-full">
      <div className={cn("mx-auto p-4", maxWidthClass)}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={MIN_ROWS}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none min-w-0 resize-none overflow-y-auto min-h-[20px] max-h-[160px] py-1"
              style={{ minHeight: "20px" }}
            />
            <Button
              type="submit"
              size="icon-sm"
              className="bg-[#FE7A00] hover:bg-[#E56D00] text-white rounded-lg shrink-0 self-end"
            >
              <CornerRightUp className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
