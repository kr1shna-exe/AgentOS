"use client"

import * as React from "react"
import { Clock, Settings } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-end gap-2 p-4">
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
