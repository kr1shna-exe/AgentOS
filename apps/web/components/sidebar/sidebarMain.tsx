"use client"

import * as React from "react"
import { Search, LogIn, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ChatHistory } from "../chat/chatHistory"
import { DriveFiles } from "./driveFiles"
import { useSidebar } from "./sidebarContext"
import { isAuthenticated, clearToken } from "@/lib/auth"
import { cn } from "@workspace/ui/lib/utils"

interface SidebarProps {
  onLoginClick: () => void
  onNewChat?: () => void
}

export function Sidebar({ onLoginClick, onNewChat }: SidebarProps) {
  const { isOpen, toggle } = useSidebar()
  const [auth, setAuth] = React.useState(false)

  React.useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  React.useEffect(() => {
    const onAuthChange = () => setAuth(isAuthenticated())
    window.addEventListener("auth-change", onAuthChange)
    return () => window.removeEventListener("auth-change", onAuthChange)
  }, [])

  const handleLogout = () => {
    clearToken()
    window.location.href = "/"
  }

  return (
    <>
      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 text-gray-600 dark:text-gray-400"
          onClick={toggle}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-gray-900 transition-transform duration-300",
          isOpen ? "flex translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 p-4">
          {/* Logo/Brand + Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            <a
              href="/"
              className="flex items-center gap-2 px-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/agentos-logo.png"
                alt="AgentOS"
                className="w-6 h-6 object-contain"
              />
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">AgentOS</h1>
            </a>
          </div>

          {/* New Chat Button */}
          <Button
            className="w-full text-white font-medium h-10 rounded-lg shadow-sm bg-[#FE7A00] hover:bg-[#E56D00]"
            size="default"
            onClick={onNewChat}
          >
            New Chat
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your files..."
              className="pl-9 h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
        </div>

        {/* Drive Files */}
        <DriveFiles />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <ChatHistory />
        </div>

        {/* Login / Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {auth ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onLoginClick}
            >
              <LogIn className="h-4 w-4" />
              <span className="text-sm">Login</span>
            </Button>
          )}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggle}
        />
      )}
    </>
  )
}
