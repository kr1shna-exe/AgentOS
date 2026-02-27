"use client"

import * as React from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { SidebarProvider, useSidebar } from "@/components/sidebar/sidebarContext"
import { Sidebar } from "@/components/sidebar/sidebarMain"
import { ChatContainer } from "@/components/chat/chatContainer"
import { useAgentRun } from "@/hooks/useAgentRun"

function ChatPageContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const { isOpen } = useSidebar()
  const runId = params?.id ?? null
  const initialQuestion = searchParams.get("q")

  const { task, status, steps, result, error, startRun, loadRun } = useAgentRun()

  React.useEffect(() => {
    if (initialQuestion && !task) {
      startRun(initialQuestion)
    } else if (!initialQuestion && runId && !task) {
      loadRun(runId)
    }
  }, [initialQuestion, runId, task, startRun, loadRun])

  const handleSendMessage = React.useCallback(
    (message: string) => {
      startRun(message)
    },
    [startRun]
  )

  const handleLoginClick = () => router.push("/login")
  const handleNewChat = () => router.push(`/chat/${Date.now()}`)

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-black">
      <Sidebar onLoginClick={handleLoginClick} onNewChat={handleNewChat} />
      <main className={isOpen ? "flex-1 lg:ml-64" : "flex-1 ml-0"}>
        <ChatContainer
          task={task}
          status={status}
          steps={steps}
          result={result}
          error={error}
          onSendMessage={handleSendMessage}
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
