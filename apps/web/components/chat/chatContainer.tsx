"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Message } from "../response"
import { ChatInput } from "../chatInput"
import { Header } from "../ui/header"
import { Loading } from "../loading"
import { StepCard } from "./stepCard"
import type { Step, AgentResult } from "@/lib/types"
import { RunStatus, ChatContainerProps } from "@/types/chat.type"

const CHAT_MAX_WIDTH = "max-w-2xl"

export function ChatContainer({ task, status, steps, result, error, onSendMessage, sidebarOpen = true }: ChatContainerProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [task, steps, result, status])

  const isRunning = status === "planning" || status === "executing"
  const hasContent = task || steps.length > 0 || result || error

  return (
    <div className="flex flex-col h-screen">
      <Header sidebarOpen={sidebarOpen} />

      <div className="flex-1 overflow-y-auto pt-16 pb-32 bg-[#FAFAFA] dark:bg-black">
        {!hasContent ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Start a conversation...
            </p>
          </div>
        ) : (
          <div className={cn("mx-auto w-full", CHAT_MAX_WIDTH)}>
            {/* User message */}
            {task && (
              <Message
                role="user"
                content={task}
                timestamp={new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              />
            )}

            {/* Agent response: steps + result - default background, AgentOS logo */}
            {(steps.length > 0 || result || error) && (
              <div className="flex px-6 py-4 bg-[#FAFAFA] dark:bg-black">
                <div className="flex gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/agentos-logo.png"
                      alt="AgentOS"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        AgentOS
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {/* Step cards - default background */}
                    {steps.length > 0 && (
                      <div className="space-y-0 bg-transparent">
                        {steps.map((step, i) => (
                          <StepCard
                            key={step.index}
                            step={step}
                            isLast={
                              i === steps.length - 1 && !result && !error
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* Loading indicator */}
                    {isRunning && (
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-6 bg-[#FAFAFA] dark:bg-black">
                        <Loading size="sm" />
                      </div>
                    )}

                    {/* Final answer - default background, no white bubble */}
                    {result && (
                      <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {result.answer}
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div
        className={cn(
          "fixed bottom-0 right-0 transition-[left] duration-300",
          sidebarOpen ? "left-64" : "left-0"
        )}
      >
        <ChatInput onSend={onSendMessage} maxWidthClass={CHAT_MAX_WIDTH} />
      </div>
    </div>
  )
}
