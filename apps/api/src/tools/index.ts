import { driveRetrievalTool } from "./drive.retrieval";
import { registry } from "./registry";
import { vectorSearchTool } from "./vectorsearch";
import { webScrapeTool } from "./webscraper";
import { webSearchTool } from "./websearcher";

// Register all agent tools with the shared registry. Call once at startup
export function initTools(): void {
  registry.register(webSearchTool);
  registry.register(webScrapeTool);
  registry.register(driveRetrievalTool);
  registry.register(vectorSearchTool);
}
