import { z } from "zod";

export const agentSchema = z.object({
  task: z.string(),
  status: z.enum(["pending", "planning", "executing", "completed", "failed"]).optional(),
  plan: z.string().optional(),
  steps: z.array(z.unknown()).optional(),
  result: z.unknown().optional(),
});
