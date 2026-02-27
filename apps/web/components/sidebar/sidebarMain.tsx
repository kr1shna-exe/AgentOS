"use client"

import * as React from "react"
import { Search, LogIn, Menu } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ChatHistory } from "../chat/chatHistory"
import { cn } from "@workspace/ui/lib/utils"

interface SidebarProps {
  onLoginClick: () => void
  onNewChat?: () => void
}

export function Sidebar({ onLoginClick, onNewChat }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-gray-600 dark:text-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-gray-900 transition-transform duration-300",
          isOpen ? "flex translate-x-0" : "-translate-x-full lg:translate-x-0 lg:flex"
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 p-4">
          {/* Logo/Brand */}
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <h1 className="text-sm font-medium text-gray-900 dark:text-white">AgentOS</h1>
          </button>

          {/* New Chat Button */}
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium h-10 rounded-lg shadow-sm"
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
              placeholder="Search your threads..."
              className="pl-9 h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <ChatHistory />
        </div>

        {/* Login Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onLoginClick}
          >
            <LogIn className="h-4 w-4" />
            <span className="text-sm">Login</span>
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
