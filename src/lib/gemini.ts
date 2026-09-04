import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const MODEL = "gemini-flash-latest";
const REQUEST_TIMEOUT_MS = 20000; // fail fast, well under Vercel's function limit

/**
 * Calls Gemini with a system + user prompt and parses the reply as JSON.
 * Strips markdown fences defensively since models sometimes wrap JSON in them.
 * Retries once with a stricter reminder if parsing fails.
 */
export async function callVCModel<T>(
  system: string,
  userTurn: string
): Promise<T> {
  const raw = await requestText(system, userTurn);
  const parsed = tryParse<T>(raw);
  if (parsed) return parsed;

  // one retry with a harder nudge if the model didn't return clean JSON
  const retryRaw = await requestText(
    system,
    userTurn +
      "\n\nIMPORTANT: your previous reply was not valid JSON. Respond with ONLY the raw JSON object, nothing else."
  );
  const retryParsed = tryParse<T>(retryRaw);
  if (retryParsed) return retryParsed;

  throw new Error("VC model did not return parseable JSON after retry.");
}

async function requestText(system: string, userTurn: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 700,
    },
  });

  const result = await withTimeout(
    model.generateContent(userTurn),
    REQUEST_TIMEOUT_MS,
    "Gemini request timed out"
  );

  return result.response.text();
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

function tryParse<T>(raw: string): T | null {
  const cleaned = raw
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}