import type { Step, AgentResult } from "@/lib/types"

export type RunStatus = "idle" | "planning" | "executing" | "done" | "error"

export interface ChatContainerProps {
    task: string | null
    status: RunStatus
    steps: Step[]
    result: AgentResult | null
    error: string | null
    onSendMessage?: (message: string) => void
    sidebarOpen?: boolean
};

export interface ChatInputProps {
    onSend?: (message: string) => void
    placeholder?: string
    maxWidthClass?: string
};