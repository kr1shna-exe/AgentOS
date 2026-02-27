import geminiClient from "../model/gemini";

export interface Chunk {
  text: string;
  index: number;
}

const TARGET_TOKENS = 400;
const MAX_TOKENS = 600;
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

function lastSentence(text: string): string {
  const sentences = splitSentences(text);
  return sentences[sentences.length - 1] ?? "";
}

/**
 * Splits text into overlapping chunks.
 * Uses paragraphs, then sentences when a paragraph exceeds the max.
 */
export function chunkText(text: string): Chunk[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];
  let current = "";

  const flush = () => {
    const trimmed = current.trim();
    if (trimmed) {
      chunks.push({ text: trimmed, index: chunks.length });
    }
  };

  for (const paragraph of paragraphs) {
    if (estimateTokens(paragraph) > MAX_TOKENS) {
      if (current) {
        flush();
        current = lastSentence(current) ? lastSentence(current) + " " : "";
      }
      for (const sentence of splitSentences(paragraph)) {
        const candidate = current ? current + " " + sentence : sentence;
        if (estimateTokens(candidate) > TARGET_TOKENS && current) {
          flush();
          const overlap = lastSentence(current);
          current = overlap ? overlap + " " + sentence : sentence;
        } else {
          current = candidate;
        }
      }
      continue;
    }

    const candidate = current ? current + "\n\n" + paragraph : paragraph;

    if (estimateTokens(candidate) <= TARGET_TOKENS) {
      current = candidate;
    } else {
      if (current) {
        flush();
        const overlap = lastSentence(current);
        current = overlap ? overlap + "\n\n" + paragraph : paragraph;
      } else {
        current = paragraph;
      }
    }
  }

  flush();
  return chunks;
}

const EMBED_MODEL = "text-embedding-004";
const BATCH_SIZE = 5;

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GEMINI_API;

export async function embedText(text: string): Promise<number[]> {
  if (!apiKey) throw new Error("GEMINI_API_KEY or GOOGLE_GEMINI_API is not set");

  const result = await geminiClient.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
  });

  const values = result.embeddings?.[0]?.values;
  if (!values) throw new Error("Gemini returned no embedding values");
  return values;
}

export async function embedChunks(chunks: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await Promise.all(batch.map(embedText));
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}
