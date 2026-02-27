import { z } from "zod";

// Request body for POST /agent/run
export const RunAgentBodySchema = z.object({
  task: z.string().min(1, "Task is required").max(5000),
  maxSteps: z.number().int().min(1).max(50).optional().default(10),
});

export const AgentRunSummarySchema = z.object({
  id: z.string().uuid(),
  task: z.string(),
  status: z.enum(["pending", "planning", "executing", "completed", "failed"]),
  plan: z.string().nullable(),
  steps: z.array(z.unknown()).optional(),
  result: z.unknown().optional(),
  maxSteps: z.number().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()).optional(),
});

export const RunByIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type RunAgentBody = z.infer<typeof RunAgentBodySchema>;
export type RunByIdParams = z.infer<typeof RunByIdParamsSchema>;