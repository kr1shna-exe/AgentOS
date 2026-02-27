import { FunctionCallingConfigMode, Type, type Content, type FunctionDeclaration } from "@google/genai";
import geminiClient from "../model/gemini";
import { createAgentRun, updateAgentRun } from "../repositories/agent.repo";
import { registry } from "../tools/registry";
import { generatePlan } from "./planner";
import type { AgentContext, AgentResult, Citation, SSEEvent, Step } from "./types";
  
  const MODEL = "gemini-2.5-flash";
  
  const FINISH_DECLARATION: FunctionDeclaration = {
    name: "finish",
    description:
      "Call this when you have gathered sufficient information to answer the task completely. Do not call other tools after this.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        thought: {
          type: Type.STRING,
          description: "Brief summary of what you discovered",
        },
        answer: {
          type: Type.STRING,
          description: "Your complete, well-structured final answer to the task",
        },
      },
      required: ["answer"],
    },
  };
  
  function buildSystemPrompt(task: string, plan: string): string {
    return `You are an autonomous AI research agent. Complete the user's task by using tools step by step.
  
  Task: ${task}
  
  Your plan:
  ${plan}
  
  Rules:
  - Always include your reasoning in the "thought" parameter when calling any tool
  - Analyse each tool result before deciding the next step
  - Use vector_search or drive_retrieval for questions about the user's own documents
  - Use web_search then web_scrape for up-to-date information from the internet
  - Call "finish" as soon as you have enough information to give a complete answer
  - Never call the same tool twice with identical arguments`;
  }
  
export async function* runAgent( task: string, userId: string, maxSteps = 10 ): AsyncGenerator<SSEEvent> {
    const run = await createAgentRun(userId, task, maxSteps);
    const runId = run.id;
    const context: AgentContext = { runId, userId, task };
  
    try {
      await updateAgentRun(runId, { status: "planning" });
  
      const tools = registry.getAll();
      const plan = await generatePlan(task, tools);
      await updateAgentRun(runId, { status: "executing", plan });
      yield { type: "plan", data: { runId, plan } };
  
      const functionDeclarations: FunctionDeclaration[] = [
        ...registry.toGeminiFunctionDeclarations(),
        FINISH_DECLARATION,
      ];
  
      const systemPrompt = buildSystemPrompt(task, plan);
      const conversation: Content[] = [
        { 
            role: "user", 
            parts: [{ text: `Task: ${task}` }] 
        },
      ];
  
      const steps: Step[] = [];
      const allCitations: Citation[] = [];
  
      for (let i = 0; i < maxSteps; i++) {
        const response = await geminiClient.models.generateContent({
          model: MODEL,
          contents: conversation,
          config: {
            systemInstruction: systemPrompt,
            tools: [{ functionDeclarations }],
            toolConfig: {
              functionCallingConfig: { 
                mode: FunctionCallingConfigMode.ANY 
            },
            },
          },
        });
  
        const functionCall = response.functionCalls?.[0];
        if (!functionCall?.name) break;
        const toolName: string = functionCall.name;
  
        const args = (functionCall.args ?? {}) as Record<string, unknown>;
        const thought = String(args["thought"] ?? "");
  
        if (toolName === "finish") {
          const answer = String(args["answer"] ?? "No answer produced.");
          const result: AgentResult = {
            answer,
            citations: allCitations,
            stepsExecuted: i,
            completionReason: "finished",
          };
          await updateAgentRun(runId, { status: "completed", steps, result });
          yield { type: "result", data: { runId, result } };
          return;
        }
  
        const { thought: _t, ...toolArgs } = args;
        void _t;
  
        const step: Step = {
          index: i,
          thought,
          toolName,
          toolArgs,
          status: "executing",
          startedAt: new Date().toISOString(),
        };
        yield { type: "step_start", data: step };
  
        let toolResult;
        try {
          const tool = registry.getTool(toolName);
          toolResult = await tool.execute(toolArgs, context);
        } catch (err) {
          toolResult = {
            success: false,
            data: null,
            error: err instanceof Error ? err.message : "Tool execution failed",
          };
        }
  
        step.result = toolResult;
        step.status = toolResult.success ? "completed" : "failed";
        step.completedAt = new Date().toISOString();
        steps.push(step);
  
        if (toolResult.citations) allCitations.push(...toolResult.citations);
  
        await updateAgentRun(runId, { steps });
        yield { type: "step_complete", data: step };
  
        conversation.push(
          { role: "model", parts: [{ functionCall }] },
          {
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: functionCall.name,
                  response: toolResult.success
                    ? { result: toolResult.data }
                    : { error: toolResult.error },
                },
              },
            ],
          },
        );
      }
  
      const result: AgentResult = {
        answer:
          "Reached the step limit. Based on what I found: " +
          steps
            .filter((s) => s.result?.success)
            .map((s) => JSON.stringify(s.result?.data).slice(0, 300))
            .join(" | "),
        citations: allCitations,
        stepsExecuted: maxSteps,
        completionReason: "step_limit",
      };
      await updateAgentRun(runId, { status: "completed", steps, result });
      yield { type: "result", data: { runId, result } };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Agent failed";
      await updateAgentRun(runId, { status: "failed" });
      yield { type: "error", data: { runId, error } };
    }
  }