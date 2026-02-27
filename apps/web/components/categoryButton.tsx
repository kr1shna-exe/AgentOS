"use client"

import * as React from "react"
import { Sparkles, Compass, Code, GraduationCap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const categories = [
  {
    id: "create",
    label: "Create",
    icon: Sparkles,
  },
  {
    id: "explore",
    label: "Explore",
    icon: Compass,
  },
  {
    id: "code",
    label: "Code",
    icon: Code,
  },
  {
    id: "learn",
    label: "Learn",
    icon: GraduationCap,
  },
]

interface CategoryButtonsProps {
  onCategoryClick?: (categoryId: string) => void
}

export function CategoryButtons({ onCategoryClick }: CategoryButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Button
            key={category.id}
            variant="outline"
            className="gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 h-9"
            onClick={() => onCategoryClick?.(category.id)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{category.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
