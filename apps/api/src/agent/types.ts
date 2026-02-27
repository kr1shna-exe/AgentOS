export interface Citation {
    title: string;
    url?: string;
    fileName?: string;
    source: "web" | "drive" | "vector_search";
};
  
export interface ToolResult {
    success: boolean;
    data: unknown;
    citations?: Citation[];
    error?: string;
};
  
export interface AgentContext {
    runId: string;
    userId: string;
    task: string;
};
  
export interface Tool {
    name: string;
    description: string;
    parameters: Record<string, { type: string; description: string; required?: boolean }>;
    execute: (args: Record<string, unknown>, context: AgentContext) => Promise<ToolResult>;
};
  
export type StepStatus = "pending" | "executing" | "completed" | "failed";
  
export interface Step {
    index: number;
    thought: string;
    toolName: string;
    toolArgs: Record<string, unknown>;
    result?: ToolResult;
    status: StepStatus;
    startedAt?: string;
    completedAt?: string;
};
  
export type AgentRunStatus = "pending" | "planning" | "executing" | "completed" | "failed";
  
export interface AgentState {
    runId: string;
    task: string;
    status: AgentRunStatus;
    plan: string;
    steps: Step[];
    result?: AgentResult;
    maxSteps: number;
    currentStep: number;
};
  
export type CompletionReason = "finished" | "step_limit" | "error";
  
export interface AgentResult {
    answer: string;
    citations: Citation[];
    stepsExecuted: number;
    completionReason: CompletionReason;
};
  
export type SSEEventType =
    | "plan"
    | "step_start"
    | "step_complete"
    | "result"
    | "error";
  
export interface SSEEvent {
    type: SSEEventType;
    data: unknown;
};