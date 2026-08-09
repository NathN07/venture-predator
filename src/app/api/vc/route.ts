import { NextRequest, NextResponse } from "next/server";
import { callVCModel } from "@/lib/gemini";
import { VC_SYSTEM_PROMPT, buildUserTurn, MAX_ROUNDS } from "@/lib/vcPersona";
import { StartupInfo, QARound, VCResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
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
      { error: "The VC hung up. Try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 30;
export const MAX_QUESTION_ROUNDS = MAX_ROUNDS;
