import geminiClient from "../llm/gemini";
import type { Tool } from "./types";

const MODEL = "gemini-2.5-flash";

export async function generatePlan( task: string, tools: Tool[] ): Promise<string> {
  const toolList = tools.map((t) => `- ${t.name}: ${t.description}`).join("\n");

  const response = await geminiClient.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Task: ${task}\n\nAvailable tools:\n${toolList}\n\nCreate a concise, actionable plan (3-5 steps) to complete this task. Be specific about which tools you will use and why.`,
          },
        ],
      },
    ],
    config: {
      systemInstruction:
        "You are a planning assistant. Produce a brief, step-by-step plan. Focus on clarity and the tools available.",
    },
  });

  return response.text ?? "Execute the task using the available tools.";
}
