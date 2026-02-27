import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? env.GOOGLE_GEMINI_API ?? "";

const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default geminiClient;
