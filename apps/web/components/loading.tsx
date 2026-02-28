import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots"
  className?: string
  text?: string
}

export function Loading({ size = "md", variant = "spinner", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "0ms", animationDuration: "1s" }}
          />
          <span
            className={cn(
              "rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "150ms", animationDuration: "1s" }}
          />
          <span
            className={cn(
              "rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "300ms", animationDuration: "1s" }}
          />
        </div>
        {text && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-pink-500")} />
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  )
}
