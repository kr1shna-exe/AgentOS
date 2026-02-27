import type { Response } from "express";
import { Router } from "express";
import { runAgent } from "../agent/loop";
import type { SSEEvent } from "../agent/types";
import {
  findAgentRunById,
  listAgentRunsByUser,
  parseResult,
  parseSteps,
} from "../repositories/agent.repo";
import { authMiddleware, type AuthRequest } from "../middleware/auth";
import { RunAgentBody } from "../validators/agent.validator";

export const agentRouter = Router();

agentRouter.use(authMiddleware);

export const agentStart = async ( req: Request, res: Response ) => {
    try {
    const parsed = RunAgentBody.safeParse(req.body);
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

  // Interval to prevent proxy timeouts
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 20_000);

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
export const getAllAgentsRun = async ( req: Request, res: Response ) => {
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
        maxSteps: r.maxSteps,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
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

export const runAgentById = async ( req: Request, res: Response ) => {

  const runId = String(req.params["id"] ?? "");
  const run = await findAgentRunById(runId);
  if (!run) {
    res.status(404).json({ 
        success: false,
        message: null,
        error: "AGENT_ID_NOT_FOUND" 
    })
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
      maxSteps: run.maxSteps,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
    },
  });
};
