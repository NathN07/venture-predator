// Simple in-memory rate limiter. Good enough for a solo/small-audience deploy —
// resets on cold start / redeploy, and isn't shared across serverless instances,
// but that's an acceptable tradeoff for stopping casual abuse without adding
// an external dependency (Redis, etc).

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 15; // per IP per window

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true };
}

// Periodically clear old buckets so the map doesn't grow forever on a long-lived instance.
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS * 2) buckets.delete(ip);
  }
}, WINDOW_MS * 2).unref?.();
