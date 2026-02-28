import { registry } from "./registry";
import { vectorSearchTool } from "./vectorsearch";
import { webScrapeTool } from "./webscraper.tool";
import { webSearchTool } from "./websearch.tool";

// Register all agent tools with the shared registry. Call once at startup
// Order matters: vector_search first so the agent tries user's documents before web.
export function initTools(): void {
  registry.register(vectorSearchTool);
  registry.register(webSearchTool);
  registry.register(webScrapeTool);
}
