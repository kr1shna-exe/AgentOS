import { randomUUID } from "node:crypto";
import { qdrant } from "../config/qdrant";
import type { Citation } from "../agent/types";

const COLLECTION = "drive_documents";
const VECTOR_SIZE = 768;

interface ChunkPayload {
  userId: string;
  fileId: string;
  fileName: string;
  chunkIndex: number;
  content: string;
}

export interface VectorSearchResult {
  content: string;
  fileName: string;
  score: number;
}

export async function ensureVectorCollection(): Promise<void> {
  const { collections } = await qdrant.getCollections();
  const exists = collections.some((c) => c.name === COLLECTION);

  if (exists) {
    const info = await qdrant.getCollection(COLLECTION);
    const config = info.config?.params?.vectors as
      | { size?: number }
      | undefined;
    const storedSize = config?.size;

    if (storedSize !== undefined && storedSize !== VECTOR_SIZE) {
      await qdrant.deleteCollection(COLLECTION);
      await qdrant.createCollection(COLLECTION, {
        vectors: { size: VECTOR_SIZE, distance: "Cosine" },
      });
    }
  } else {
    await qdrant.createCollection(COLLECTION, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine" },
    });
  }

  try {
    await qdrant.createPayloadIndex(COLLECTION, {
      field_name: "userId",
      field_schema: "keyword",
      wait: true,
    });
  } catch {
    // Index may already exist
  }

  try {
    await qdrant.createPayloadIndex(COLLECTION, {
      field_name: "fileId",
      field_schema: "keyword",
      wait: true,
    });
  } catch {
    // Index may already exist
  }
}

export async function upsertFileChunks(
  userId: string,
  fileId: string,
  fileName: string,
  chunks: string[],
  embeddings: number[][],
): Promise<void> {
  const points = chunks.map((content, i) => ({
    id: randomUUID(),
    vector: embeddings[i]!,
    payload: {
      userId,
      fileId,
      fileName,
      chunkIndex: i,
      content,
    } satisfies ChunkPayload,
  }));

  await qdrant.upsert(COLLECTION, { points });
}

export async function deleteFileChunks(
  userId: string,
  fileId: string,
): Promise<void> {
  try {
    await qdrant.delete(COLLECTION, {
      filter: {
        must: [
          { key: "userId", match: { value: userId } },
          { key: "fileId", match: { value: fileId } },
        ],
      },
    });
  } catch (err) {
    console.warn(`[vector] deleteFileChunks failed for ${fileId}:`, err);
  }
}

export async function searchSimilar(
  userId: string,
  queryVector: number[],
  topK = 5,
): Promise<VectorSearchResult[]> {
  const results = await qdrant.search(COLLECTION, {
    vector: queryVector,
    limit: topK,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
    with_payload: true,
  });

  return results.map((r) => {
    const payload = r.payload as unknown as ChunkPayload;
    return {
      content: payload.content,
      fileName: payload.fileName,
      score: r.score ?? 0,
    };
  });
}

export function resultsToCitations(
  results: VectorSearchResult[],
): Citation[] {
  return results.map((r) => ({
    title: r.fileName,
    fileName: r.fileName,
    source: "vector_search" as const,
  }));
}
