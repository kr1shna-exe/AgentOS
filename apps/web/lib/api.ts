import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

function getBaseUrl(): string {
  return `${API_BASE.replace(/\/$/, "")}${API_PREFIX}`;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getToken() : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * POST request with JSON body. Returns raw Response for streaming.
 */
export async function streamPost(
  path: string,
  body: object,
  signal?: AbortSignal
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
    signal,
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  return reader;
}
