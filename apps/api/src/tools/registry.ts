import type { FunctionDeclaration } from "@google/genai";
import { Type } from "@google/genai";
import type { Tool } from "../agent/types";

const tools = new Map<string, Tool>();

export const registry = {
  register(tool: Tool): void {
    tools.set(tool.name, tool);
  },

  getAll(): Tool[] {
    return Array.from(tools.values());
  },

  getTool(name: string): Tool | undefined {
    return tools.get(name);
  },

  toGeminiFunctionDeclarations(): FunctionDeclaration[] {
    return Array.from(tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: Type.OBJECT,
        properties: Object.fromEntries(
          Object.entries(tool.parameters).map(([key, p]) => [
            key,
            {
              type: p.type === "string" ? Type.STRING : Type.NUMBER,
              description: p.description,
            },
          ]),
        ),
        required: Object.entries(tool.parameters)
          .filter(([, p]) => p.required)
          .map(([key]) => key),
      },
    }));
  },
};
