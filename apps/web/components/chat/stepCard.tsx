"use client"

import * as React from "react"
import { CheckCircle2, ChevronDown, ChevronRight, Globe, HardDrive, Loader2, Search, XCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { Step } from "@/lib/types"

const TOOL_META: Record<string,{ label: string; colorClass: string; Icon: React.ElementType }> = {
  web_search: {
    label: "Web Search",
    colorClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-300/40",
    Icon: Search,
  },
  web_scrape: {
    label: "Web Scrape",
    colorClass:
      "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-300/40",
    Icon: Globe,
  },
  vector_search: {
    label: "Vector Search",
    colorClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300/40",
    Icon: Search,
  },
  drive_retrieval: {
    label: "Drive Retrieval",
    colorClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300/40",
    Icon: HardDrive,
  },
  finish: {
    label: "Finish",
    colorClass:
      "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-300/40",
    Icon: CheckCircle2,
  },
}

const FALLBACK_META = {
  label: "Tool",
  colorClass: "bg-gray-500/10 text-gray-700 border-gray-300/40",
  Icon: Search,
}

function formatData(data: unknown): string {
  if (typeof data === "string") return data
  return JSON.stringify(data, null, 2)
}

function truncate(str: string, max = 300) {
  return str.length > max ? str.slice(0, max) + "…" : str
}

interface StepCardProps {
  step: Step
  isLast?: boolean
}

export function StepCard({ step, isLast }: StepCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const meta = TOOL_META[step.toolName] ?? FALLBACK_META
  const { Icon } = meta
  const isExecuting = step.status === "executing"
  const isFailed = step.status === "failed"

  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
      )}

      <div className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-black">
        {isExecuting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
        ) : isFailed ? (
          <XCircle className="h-3.5 w-3.5 text-red-500" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        )}
      </div>

      <div className="mb-4 flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-black shadow-sm">
        <button
          type="button"
          className="flex w-full flex-wrap items-center gap-2 px-3 py-2.5 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium",
              meta.colorClass
            )}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Step {step.index + 1}
          </span>
          <span className="ml-auto text-gray-500 dark:text-gray-400">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        </button>

        {step.thought && (
          <p className="border-t border-gray-100 dark:border-gray-800 px-3 py-2 text-xs italic text-gray-500 dark:text-gray-400">
            {step.thought}
          </p>
        )}

        {expanded && (
          <div className="border-t border-gray-100 dark:border-gray-800 space-y-2 px-3 py-2.5">
            {Object.keys(step.toolArgs).length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Arguments
                </p>
                <pre className="overflow-x-auto rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs leading-relaxed">
                  {formatData(step.toolArgs)}
                </pre>
              </div>
            )}
            {step.result && (
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {step.result.success ? "Result" : "Error"}
                </p>
                {step.result.success ? (
                  <pre className="overflow-x-auto rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs leading-relaxed">
                    {truncate(formatData(step.result.data))}
                  </pre>
                ) : (
                  <p className="rounded bg-red-50 dark:bg-red-900/20 p-2 text-xs text-red-600 dark:text-red-400">
                    {step.result.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
