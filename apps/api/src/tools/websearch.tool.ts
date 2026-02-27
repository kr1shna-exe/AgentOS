import type { AgentContext, Citation, Tool, ToolResult } from "../agent/types";

const SERPER_URL = "https://google.serper.dev/search";

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
}

interface SerperResponse {
  organic?: SerperResult[];
  answerBox?: { answer?: string; snippet?: string; title?: string };
}

const DEFAULT_NUM_RESULTS = 5;
const MAX_NUM_RESULTS = 10;

export const webSearchTool: Tool = {
  name: "web_search",
  description:
    "Search the web for current information. Returns page titles, URLs, and snippets.",
  parameters: {
    query: {
      type: "string",
      description: "The search query",
      required: true,
    },
    numResults: {
      type: "number",
      description: "Number of results to return (default 5, max 10)",
      required: false,
    },
  },

  async execute(
    args: Record<string, unknown>,
    _context: AgentContext,
  ): Promise<ToolResult> {
    const query = String(args["query"] ?? "").trim();
    const rawNum = Number(args["numResults"] ?? DEFAULT_NUM_RESULTS);
    const numResults = Math.min(
      Number.isNaN(rawNum) ? DEFAULT_NUM_RESULTS : rawNum,
      MAX_NUM_RESULTS,
    );

    if (!query) {
      return { success: false, data: null, error: "query is required" };
    }

    const apiKey = process.env.SERPER_API_KEY ?? process.env.SERPER_API;
    if (!apiKey) {
      return {
        success: false,
        data: null,
        error: "SERPER_API_KEY or SERPER_API is not set",
      };
    }

    let response: Response;
    try {
      response = await fetch(SERPER_URL, {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: numResults }),
      });
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err instanceof Error ? err.message : "Serper request failed",
      };
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        success: false,
        data: null,
        error: `Serper API error: ${response.status}${text ? ` - ${text.slice(0, 200)}` : ""}`,
      };
    }

    let json: SerperResponse;
    try {
      json = (await response.json()) as SerperResponse;
    } catch {
      return {
        success: false,
        data: null,
        error: "Invalid JSON response from Serper",
      };
    }

    const organic = json.organic?.slice(0, numResults) ?? [];

    const results = organic.map((r) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
      position: r.position,
    }));

    const citations: Citation[] = organic.map((r) => ({
      title: r.title,
      url: r.link,
      source: "web" as const,
    }));

    const answerBox = json.answerBox;
    const summary = answerBox?.answer ?? answerBox?.snippet ?? null;

    return {
      success: true,
      data: { query, results, answerBox: summary },
      citations,
    };
  },
};