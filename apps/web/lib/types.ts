// Types mirroring backend API responses.

export interface Citation {
  title: string;
  url?: string;
  fileName?: string;
  source: "web" | "drive" | "vector_search";
}

export interface AgentResult {
  answer: string;
  citations: Citation[];
  stepsExecuted: number;
  completionReason: "finished" | "step_limit" | "error";
}

export type StepStatus = "pending" | "executing" | "completed" | "failed";

export interface Step {
  index: number;
  thought: string;
  toolName: string;
  toolArgs: Record<string, unknown>;
  result?: {
    success: boolean;
    data: unknown;
    citations?: Citation[];
    error?: string;
  };
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentRun {
  id: string;
  task: string;
  status: "pending" | "planning" | "executing" | "completed" | "failed";
  plan: string | null;
  steps: Step[];
  result: AgentResult | null;
  maxSteps?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriveFile {
  id: string;
  userId: string;
  driveFileId: string;
  name: string;
  mimeType: string | null;
  contentHash: string | null;
  modifiedTime: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
}

export type SyncEvent =
  | { type: "started"; totalFiles: number }
  | { type: "file_processing"; fileName: string; fileId: string }
  | {
      type: "file_completed";
      fileName: string;
      fileId: string;
      processedFiles: number;
      skippedFiles: number;
    }
  | { type: "file_skipped"; fileName: string; fileId: string }
  | { type: "file_error"; fileName: string; fileId: string; error: string }
  | {
      type: "completed";
      totalFiles: number;
      processedFiles: number;
      skippedFiles: number;
    }
  | { type: "error"; error: string };
