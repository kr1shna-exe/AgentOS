"use client"

import * as React from "react"
import { Clock, Settings } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

interface HeaderProps {
  sidebarOpen?: boolean
}

export function Header({ sidebarOpen = true }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex items-center justify-end gap-2 p-4 transition-[left] duration-300",
        sidebarOpen ? "left-64" : "left-0"
      )}
    >
      <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <Clock className="h-5 w-5" />
      </Button>
      <ThemeToggle />
      <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  )
}
