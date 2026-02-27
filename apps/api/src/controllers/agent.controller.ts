import type { Response } from "express";
import { runAgent } from "../agent/agent";
import type { SSEEvent } from "../agent/types";
import {
  findAgentRunById,
  listAgentRunsByUser,
  parseResult,
  parseSteps,
} from "../store/agent.store";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";
import { RunAgentBodySchema } from "../agent/schema";

export const agentStart = async (req: AuthRequest, res: Response) => {
  const parsed = RunAgentBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { task, maxSteps } = parsed.data;
  const userId = req.user!.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit = (event: SSEEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 20_000);

  try {
    for await (const event of runAgent(task, userId, maxSteps)) {
      emit(event);
      if (event.type === "result" || event.type === "error") break;
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    emit({ type: "error", data: { error } });
  } finally {
    clearInterval(keepAlive);
    res.end();
  }
};

// List past runs for the authenticated user
export const getAllAgentsRun = async (req: AuthRequest, res: Response) => {
  try {
    const runs = await listAgentRunsByUser(req.user!.userId);
    res.json({
      runs: runs.map((r) => ({
        id: r.id,
        task: r.task,
        status: r.status,
        plan: r.plan,
        steps: parseSteps(r),
        result: parseResult(r),
        maxSteps: (r as { maxSteps?: number }).maxSteps ?? 10,
        createdAt: r.createdAt,
        updatedAt: (r as { updatedAt?: Date }).updatedAt ?? r.createdAt,
      })),
    });
  } catch (err) {
    console.error("Failed to list agent runs:", err);

    res.status(500).json({ 
        success: false,
        message: null,
        error: "FAILED_TO_RETRIVE_RUNS" 
    })
    return;
  }
};

export const runAgentById = async (req: AuthRequest, res: Response) => {
  const runId = String(req.params["id"] ?? "");
  const userId = req.user!.userId;

  const run = await findAgentRunById(runId);
  if (!run) {
    res.status(404).json({
      success: false,
      message: null,
      error: "AGENT_ID_NOT_FOUND",
    });
    return;
  }

  if (run.userId !== userId) {
    res.status(403).json({
      success: false,
      message: null,
      error: "FORBIDDEN",
    });
    return;
  }

  res.json({
    run: {
      id: run.id,
      task: run.task,
      status: run.status,
      plan: run.plan,
      steps: parseSteps(run),
      result: parseResult(run),
      maxSteps: (run as { maxSteps?: number }).maxSteps ?? 10,
      createdAt: run.createdAt,
      updatedAt: (run as { updatedAt?: Date }).updatedAt ?? run.createdAt,
    },
  });
};
