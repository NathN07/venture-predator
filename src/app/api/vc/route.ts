import { NextRequest, NextResponse } from "next/server";
import { callVCModel } from "@/lib/gemini";
import { VC_SYSTEM_PROMPT, buildUserTurn } from "@/lib/vcPersona";
import { StartupInfo, QARound, VCResponse } from "@/lib/types";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfterSeconds } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many pitches. Vesper needs a break — try again in ${retryAfterSeconds}s.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds ?? 60) } }
      );
    }

    const body = await req.json();
    const startup = body.startup as StartupInfo;
    const history = (body.history ?? []) as QARound[];

    if (!startup?.name || !startup?.pitch || !startup?.market) {
      return NextResponse.json(
        { error: "Missing startup name, pitch, or market." },
        { status: 400 }
      );
    }

    const roundNumber = history.length + 1;
    const userTurn = buildUserTurn(startup, history, roundNumber);

    const result = await callVCModel<VCResponse>(VC_SYSTEM_PROMPT, userTurn);

    return NextResponse.json(result);
  } catch (err) {
    console.error("VC route error:", err);
    return NextResponse.json(
      { error: "Google's AI service is under heavy load right now. Give it a few seconds and try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 55;
