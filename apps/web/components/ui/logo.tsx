import * as React from "react"
import { MessageSquare } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-8 w-8",
  }

  const roundedClasses = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-2xl",
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        roundedClasses[size],
        "bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg",
        className
      )}
    >
      <MessageSquare className={cn(iconSizes[size], "text-white")} />
    </div>
  )
}
