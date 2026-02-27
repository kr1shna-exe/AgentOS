"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar/sidebarMain"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleNewChat = () => {
    const newChatId = Date.now().toString()
    router.push(`/chat/${newChatId}`)
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-black">
      <Sidebar onLoginClick={handleLoginClick} onNewChat={handleNewChat} />
      <main className="flex-1 lg:ml-64">
        <Dashboard />
      </main>
    </div>
  )
}
