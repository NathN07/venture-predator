import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

const MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 20000;
const MAX_OVERLOAD_RETRIES = 2;
const OVERLOAD_RETRY_DELAY_MS = 1200;

export async function callVCModel<T>(
  system: string,
  userTurn: string
): Promise<T> {
  const raw = await requestTextWithOverloadRetry(system, userTurn);
  const parsed = tryParse<T>(raw);
  if (parsed) return parsed;

  const retryRaw = await requestTextWithOverloadRetry(
    system,
    userTurn +
      "\n\nIMPORTANT: your previous reply was not valid JSON. Respond with ONLY the raw JSON object, nothing else."
  );
  const retryParsed = tryParse<T>(retryRaw);
  if (retryParsed) return retryParsed;

  throw new Error("VC model did not return parseable JSON after retry.");
}

async function requestTextWithOverloadRetry(
  system: string,
  userTurn: string
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_OVERLOAD_RETRIES; attempt++) {
    try {
      return await requestText(system, userTurn);
    } catch (err) {
      lastError = err;
      if (!isOverloadError(err) || attempt === MAX_OVERLOAD_RETRIES) {
        throw err;
      }
      await sleep(OVERLOAD_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError;
}

function isOverloadError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("429") ||
    lower.includes("overloaded") ||
    lower.includes("rate limit") ||
    lower.includes("service unavailable")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestText(system: string, userTurn: string): Promise<string> {
  const completion = await withTimeout(
    groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userTurn },
      ],
      response_format: { type: "json_object" },
      max_tokens: 700,
    }),
    REQUEST_TIMEOUT_MS,
    "Groq request timed out"
  );

  return completion.choices[0]?.message?.content ?? "";
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