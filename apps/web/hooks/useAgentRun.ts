"use client";

import { useCallback, useRef, useState } from "react";
import { apiGet, streamPost } from "@/lib/api";
import type { AgentResult, AgentRun, Citation, Step } from "@/lib/types";

export type RunStatus = "idle" | "planning" | "executing" | "done" | "error";

interface SSEEnvelope {
  type: string;
  data: unknown;
}

interface PlanData {
  runId: string;
  plan: string;
}

interface ResultData {
  runId: string;
  result: AgentResult;
}

interface ErrorData {
  runId?: string;
  error: string;
}

export interface AgentRunState {
  status: RunStatus;
  runId: string | null;
  task: string | null;
  plan: string | null;
  steps: Step[];
  result: AgentResult | null;
  error: string | null;
  allCitations: Citation[];
}

export function useAgentRun() {
  const [state, setState] = useState<AgentRunState>({
    status: "idle",
    runId: null,
    task: null,
    plan: null,
    steps: [],
    result: null,
    error: null,
    allCitations: [],
  });

  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      runId: null,
      task: null,
      plan: null,
      steps: [],
      result: null,
      error: null,
      allCitations: [],
    });
  }, []);

  const startRun = useCallback(
    async (task: string, maxSteps = 10) => {
      reset();
      setState((s) => ({ ...s, task, status: "planning" }));

      abortRef.current = new AbortController();

      try {
        const reader = await streamPost(
          "/agent/run",
          { task, maxSteps },
          abortRef.current.signal
        );

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let envelope: SSEEnvelope;
            try {
              envelope = JSON.parse(raw) as SSEEnvelope;
            } catch {
              continue;
            }

            switch (envelope.type) {
              case "plan": {
                const d = envelope.data as PlanData;
                setState((s) => ({
                  ...s,
                  runId: d.runId,
                  plan: d.plan,
                  status: "executing",
                }));
                break;
              }
              case "step_start": {
                const step = envelope.data as Step;
                setState((s) => ({ ...s, steps: [...s.steps, step] }));
                break;
              }
              case "step_complete": {
                const step = envelope.data as Step;
                setState((s) => ({
                  ...s,
                  steps: s.steps.map((prev) =>
                    prev.index === step.index ? step : prev
                  ),
                  allCitations: [
                    ...s.allCitations,
                    ...(step.result?.citations ?? []),
                  ],
                }));
                break;
              }
              case "result": {
                const d = envelope.data as ResultData;
                setState((s) => ({
                  ...s,
                  runId: d.runId,
                  result: d.result,
                  status: "done",
                }));
                break;
              }
              case "error": {
                const d = envelope.data as ErrorData;
                setState((s) => ({
                  ...s,
                  error: d.error,
                  status: "error",
                }));
                break;
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : "Unknown error",
          status: "error",
        }));
      }
    },
    [reset]
  );

  const loadRun = useCallback(async (runId: string) => {
    try {
      const data = await apiGet<{ run: AgentRun }>(`/agent/runs/${runId}`);
      const r = data.run;
      const statusMap: Record<string, RunStatus> = {
        completed: "done",
        failed: "error",
        planning: "planning",
        executing: "executing",
        pending: "planning",
      };
      const allCitations: Citation[] = (r.steps ?? []).flatMap(
        (s) => s.result?.citations ?? []
      );
      setState({
        status: statusMap[r.status] ?? "done",
        runId: r.id,
        task: r.task,
        plan: r.plan ?? null,
        steps: r.steps ?? [],
        result: r.result ?? null,
        error: r.status === "failed" ? "This run failed." : null,
        allCitations,
      });
    } catch (err) {
      console.error("Failed to load run:", err);
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({ ...s, status: "idle" }));
  }, []);

  return { ...state, startRun, loadRun, cancel, reset };
}
