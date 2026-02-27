import type { drive_v3 } from "googleapis";
import { downloadFileAsBuffer, exportDocAsText, type DriveFile } from "./index";

const MIME_GOOGLE_DOC = "application/vnd.google-apps.document";
const MIME_PDF = "application/pdf";
const TEXT_MIME_PREFIX = "text/";

async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = await import("pdf-parse");
  const fn =
    (pdfParse as { default?: (b: Buffer) => Promise<{ text?: string }> }).default ??
    (pdfParse as unknown as (b: Buffer) => Promise<{ text?: string } | string>);
  const result = await fn(buffer);
  return typeof result === "string" ? result : (result?.text ?? "") || "";
}

export async function extractContent(
  drive: drive_v3.Drive,
  file: DriveFile,
): Promise<string | null> {
  const { id, mimeType, name } = file;
  if (!id || !mimeType) return null;

  try {
    if (mimeType === MIME_GOOGLE_DOC) {
      const text = await exportDocAsText(drive, id);
      return text?.trim() || null;
    }

    if (mimeType === MIME_PDF) {
      const buffer = await downloadFileAsBuffer(drive, id);
      const text = await parsePdf(buffer);
      return (text && text.trim()) || null;
    }

    if (mimeType.startsWith(TEXT_MIME_PREFIX)) {
      const buffer = await downloadFileAsBuffer(drive, id);
      return buffer.toString("utf-8").trim() || null;
    }

    return null;
  } catch (err) {
    console.error(`[extract] Failed to extract "${name}" (${id}):`, err);
    return null;
  }
}