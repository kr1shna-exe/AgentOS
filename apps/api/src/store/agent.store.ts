import type { AgentResult, AgentRunStatus, Step } from "../agent/types";
import { db, type AgentRun } from "@repo/database";

export async function createAgentRun(
  userId: string,
  task: string,
  maxSteps: number,
): Promise<AgentRun> {
  return db.agentRun.create({
    data: { userId, task, maxSteps, status: "pending" },
  });
}

type AgentRunUpdatePayload = Partial<{
  status: AgentRunStatus;
  plan: string;
  steps: Step[];
  result: AgentResult;
}>;

export async function updateAgentRun(
  runId: string,
  payload: AgentRunUpdatePayload,
): Promise<void> {
  const data: Record<string, unknown> = {};
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.plan !== undefined) data.plan = payload.plan;
  if (payload.steps !== undefined) data.steps = payload.steps as object;
  if (payload.result !== undefined) data.result = payload.result as object;

  if (Object.keys(data).length === 0) return;

  await db.agentRun.update({
    where: { id: runId },
    data,
  });
}

export async function findAgentRunById(runId: string): Promise<AgentRun | null> {
  return db.agentRun.findUnique({ where: { id: runId } });
}

export async function listAgentRunsByUser(
  userId: string,
  limit = 20,
): Promise<AgentRun[]> {
  return db.agentRun.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function parseSteps(run: AgentRun): Step[] {
  return (run.steps as unknown as Step[]) ?? [];
}

export function parseResult(run: AgentRun): AgentResult | null {
  return (run.result as unknown as AgentResult | null) ?? null;
}