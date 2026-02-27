import type { AgentContext, Citation, Tool, ToolResult } from "../agent/types";

interface VectorSearchResult {
  content: string;
  fileName: string;
  score: number;
}

const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 10;

export const vectorSearchTool: Tool = {
  name: "vector_search",
  description:
    "Semantically search through the user's synced Google Drive documents. Use this to find relevant passages from the user's own files.",
  parameters: {
    query: {
      type: "string",
      description: "Natural language query to search for in Drive documents",
      required: true,
    },
    topK: {
      type: "number",
      description: "Number of results to return (default 5, max 10)",
      required: false,
    },
  },

  async execute( args: Record<string, unknown>, context: AgentContext ) {

    const query = String(args["query"] ?? "").trim();
    const rawTopK = Number(args["topK"] ?? DEFAULT_TOP_K);
    const topK = Math.min(
      Number.isNaN(rawTopK) ? DEFAULT_TOP_K : Math.max(1, rawTopK),
      MAX_TOP_K,
    );

    if (!query) {
      return { 
        success: false, 
        data: null, 
        error: "QUERY_REQUIRED" 
    };
    }

    try {
      const { embedText } = await import("../utils/embedding");
      const { resultsToCitations, searchSimilar } = await import(
        "../store/vector.store"
      );

      const queryVector = await embedText(query);
      const results: VectorSearchResult[] = await searchSimilar(
        context.userId,
        queryVector,
        topK,
      );

      if (results.length === 0) {
        return {
          success: true,
          data: {
            query,
            results: [],
            hint: "No matching documents found. The user may not have synced any Drive files yet.",
          },
          citations: [],
        };
      }

      return {
        success: true,
        data: {
          query,
          results: results.map((r) => ({
            content: r.content,
            fileName: r.fileName,
            score: Number(r.score.toFixed(4)),
          })),
        },
        citations: resultsToCitations(results),
      };

    } catch (err) {
    return {
        success: false,
        data: null,
        error: "VECTOR_SEARCH_FAILED",
      };
    }
  },
};