import { load } from "cheerio";
import type { AgentContext, Citation, Tool, ToolResult } from "../agent/types";

const MAX_TEXT_LENGTH = 6000;

const NOISE_SELECTORS = [
  "script",
  "style",
  "noscript",
  "nav",
  "footer",
  "header",
  "aside",
  ".ad",
  ".ads",
  "#cookie-banner",
  "[aria-hidden='true']",
].join(", ");

const CONTENT_SELECTORS = [
  "main",
  "article",
  "[role='main']",
  ".post-content",
  ".entry-content",
  "#content",
].join(", ");

const USER_AGENT =
  "Mozilla/5.0 (compatible; LibraAgent/1.0; +https://github.com/libra-agent)";

export const webScrapeTool: Tool = {
  name: "web_scrape",
  description:
    "Fetch a URL and extract its main text content. Use after web_search to read the full content of a page.",
  parameters: {
    url: {
      type: "string",
      description: "The full URL to fetch and extract text from",
      required: true,
    },
  },

  async execute( args: Record<string, unknown>, _context: AgentContext ) {

    const url = String(args["url"] ?? "").trim();
    if (!url) {
      return { 
        success: false, 
        data: null, 
        error: "URL_REQUIRED" 
    };
    }

    let html: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,*/*",
        },
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        return {
          success: false,
          data: null,
          error: `HTTP ${response.status} fetching ${url}`,
        };
      }

      html = await response.text();

    } catch (err) {
      return {
        success: false,
        data: null,
        error: "FETCH_FAILED",
      };
    }

    const $ = load(html);
    const title = $("title").first().text().trim();

    $(NOISE_SELECTORS).remove();

    const contentEl = $(CONTENT_SELECTORS).first();
    const raw = contentEl.length ? contentEl.text() : $("body").text();

    const content = raw
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_TEXT_LENGTH);

    const citations: Citation[] = [{ title: title || url, url, source: "web" }];

    return {
      success: true,
      data: { url, title, content },
      citations,
    };
  },
};