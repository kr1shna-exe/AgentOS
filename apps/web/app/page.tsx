"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, useSidebar } from "@/components/sidebar/sidebarContext"
import { Sidebar } from "@/components/sidebar/sidebarMain"
import { Dashboard } from "@/components/dashboard"

function PageContent() {
  const router = useRouter()
  const { isOpen } = useSidebar()

  const handleLoginClick = () => router.push("/login")

  const handleNewChat = () => {
    router.push(`/chat/${Date.now()}`)
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-black">
      <Sidebar onLoginClick={handleLoginClick} onNewChat={handleNewChat} />
      <main className={isOpen ? "flex-1 lg:ml-64" : "flex-1 ml-0"}>
        <Dashboard />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <SidebarProvider>
      <PageContent />
    </SidebarProvider>
  )
}
