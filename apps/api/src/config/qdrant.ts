import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env";

const qdrantUrl =
  env.QDRANT_CLUSTER_ID ?? "http://localhost:6333";
const qdrantApiKey = env.QDRANT_API_URL;

export const qdrant = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});
