import { registry } from "./registry";
import { vectorSearchTool } from "./vectorsearch";
import { webScrapeTool } from "./webscraper.tool";
import { webSearchTool } from "./websearch.tool";

// Register all agent tools with the shared registry. Call once at startup
export function initTools(): void {
  registry.register(webSearchTool);
  registry.register(webScrapeTool);
  registry.register(vectorSearchTool);
}
