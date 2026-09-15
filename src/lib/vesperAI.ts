import { InterrogationRequest, InterrogationResponse } from './types';

// Ruthless VC Algorithmic Fallback Engine for "Vesper Prey"
export function generateVesperAlgorithmicResponse(req: InterrogationRequest): InterrogationResponse {
  const { currentRound, category, traction, founderAnswer = '', startupName } = req;
  const answerLength = founderAnswer.trim().length;
  const answerLower = founderAnswer.toLowerCase();

  // Sentiment and specificity heuristics
  const hasSpecificMetrics = /\b(\d+(\.\d+)?%?|\$\d+(k|m|b)?|nrr|cac|ltv|arr|mrr|patents|defenses|dod|cohort)\b/i.test(founderAnswer);
  const isVague = answerLength < 40 || answerLower.includes('basically') || answerLower.includes('we hope') || answerLower.includes('probably');
  const isCombative = answerLower.includes('actually') || answerLower.includes('guarantee') || answerLower.includes('exclusive');

  let hypeDelta = 0;
  let riskDelta = 0;
  let moatDelta = 0;
  let critiqueNote = '';
  let nextQuestion = '';
  let verdictSummary = '';

  if (currentRound === 1) {
    // Evaluating the initial elevator pitch & generating Round 1 Interrogation
    if (category === 'Cyber Warfare') {
      nextQuestion = `Vesper Prey: "${startupName} claims offensive capability, but procurement cycles in federal intelligence typically take 18-24 months. How do you survive that CAC drag before you vaporize your seed round?"`;
    } else if (category === 'BioTech / Longevity') {
      nextQuestion = `Vesper Prey: "Animal models are where 90% of longevity startups incinerate capital. What is your regulatory shortcut or accelerated biomarker endpoint to avoid the Phase II graveyard?"`;
    } else if (category === 'AI Agents') {
      nextQuestion = `Vesper Prey: "Everyone and their dog is shipping autonomous agents. When OpenAI or Anthropic drops their next native release, why isn't ${startupName} reduced to zero overnight?"`;
    } else if (category === 'Quantum Infra') {
      nextQuestion = `Vesper Prey: "Photonic or superconducting? If you can't hit 99.99% fidelity at room temperature without liquid helium, you're a science experiment, not a software company. Explain your hardware-cost reality."`;
    } else if (category === 'Autonomous Robotics') {
      nextQuestion = `Vesper Prey: "Hardware is hard, but robotics software is a bloodbath of edge cases. How many real-world disengagements per hour are your units logging, and who pays for the recalls?"`;
    } else {
      nextQuestion = `Vesper Prey: "${startupName}'s unit economics sound delusional on paper. What is your gross margin once you factor in compute burn and enterprise sales overhead?"`;
    }

    critiqueNote = 'Elevator pitch received. Commencing threat vector scan.';
    hypeDelta = 5;
    riskDelta = 0;
    moatDelta = 2;

    return {
      interrogation_question: nextQuestion,
      hype_score_delta: hypeDelta,
      risk_factor_delta: riskDelta,
      moat_delta: moatDelta,
      critique_note: critiqueNote,
      round_complete: false,
    };
  }

  // Evaluating answer to Round 1 -> Generating Round 2 Question (Moat & Commoditization)
  if (currentRound === 2) {
    if (isVague) {
      critiqueNote = 'Vague hand-waving detected. Zero defensible unit economics provided.';
      hypeDelta = -14;
      riskDelta = +12;
      moatDelta = -8;
    } else if (hasSpecificMetrics) {
      critiqueNote = 'Sharp response. You understand customer acquisition bottlenecks better than 90% of pitch decks.';
      hypeDelta = +12;
      riskDelta = -8;
      moatDelta = +10;
    } else {
      critiqueNote = 'Acceptable baseline answer, but margins remain paper-thin.';
      hypeDelta = +4;
      riskDelta = -2;
      moatDelta = +4;
    }

    nextQuestion = `Vesper Prey: "Let's talk about commoditization. An open-source repo with 15k GitHub stars drops tomorrow that duplicates 80% of ${startupName}'s core architecture. Where is your proprietary lock-in?"`;

    return {
      interrogation_question: nextQuestion,
      hype_score_delta: hypeDelta,
      risk_factor_delta: riskDelta,
      moat_delta: moatDelta,
      critique_note: critiqueNote,
      round_complete: false,
    };
  }

  // Evaluating answer to Round 2 -> Generating Round 3 Question (Retention & Churn)
  if (currentRound === 3) {
    if (isVague) {
      critiqueNote = 'You have no technical moat. You are a thin wrapper waiting for execution.';
      hypeDelta = -16;
      riskDelta = +15;
      moatDelta = -14;
    } else if (answerLower.includes('patent') || answerLower.includes('data') || answerLower.includes('hardware') || answerLower.includes('network effect') || hasSpecificMetrics) {
      critiqueNote = 'Calculated defensibility. Data network effects and architectural barriers verified.';
      hypeDelta = +14;
      riskDelta = -10;
      moatDelta = +16;
    } else {
      critiqueNote = 'Standard defensibility argument. Borderline acceptable.';
      hypeDelta = +5;
      riskDelta = -4;
      moatDelta = +6;
    }

    nextQuestion = `Vesper Prey: "Retention stress test: If your top 2 enterprise accounts churned next quarter due to executive turnover, does ${startupName} stay solvent? What is your actual Net Revenue Retention (NRR)?"`;

    return {
      interrogation_question: nextQuestion,
      hype_score_delta: hypeDelta,
      risk_factor_delta: riskDelta,
      moat_delta: moatDelta,
      critique_note: critiqueNote,
      round_complete: false,
    };
  }

  // Evaluating answer to Round 3 -> Generating Round 4 Question (The Apex Kill Shot)
  if (currentRound === 4) {
    if (isVague) {
      critiqueNote = 'Customer concentration risk is lethal. You are one bad quarter away from bankruptcy.';
      hypeDelta = -18;
      riskDelta = +16;
      moatDelta = -10;
    } else if (hasSpecificMetrics || answerLower.includes('expansion') || answerLower.includes('nrr') || answerLower.includes('contract')) {
      critiqueNote = 'Outstanding retention architecture. The expansion flywheel is legitimately lucrative.';
      hypeDelta = +15;
      riskDelta = -12;
      moatDelta = +12;
    } else {
      critiqueNote = 'Viable customer retention, but vulnerability remains.';
      hypeDelta = +6;
      riskDelta = -5;
      moatDelta = +5;
    }

    nextQuestion = `Vesper Prey: "Final kill shot: Why should Singularity Predator Capital wire you a $5M lead check before 5:00 PM today instead of watching you sweat for another two quarters?"`;

    return {
      interrogation_question: nextQuestion,
      hype_score_delta: hypeDelta,
      risk_factor_delta: riskDelta,
      moat_delta: moatDelta,
      critique_note: critiqueNote,
      round_complete: false,
    };
  }

  // Round 5: Final Verdict evaluation of Round 4's answer
  const finalHypeProjected = req.currentHypeScore + (hasSpecificMetrics ? 14 : isVague ? -15 : 6);
  const passed = finalHypeProjected >= 80;

  if (passed) {
    critiqueNote = 'Apex predator conviction detected. Founder exhibits relentless market dominance and mathematical clarity.';
    verdictSummary = `Singularity Predator Capital has verified ${startupName}. Founder demonstrated ruthless defensibility, superior retention vectors, and unmatched execution velocity.`;
    hypeDelta = +12;
    riskDelta = -10;
    moatDelta = +10;
  } else {
    critiqueNote = 'Insufficient velocity and ambiguous moat. Startup has been digested and purged from the Apex pipeline.';
    verdictSummary = `${startupName} failed to demonstrate an insurmountable moat under interrogation. Churn vulnerability and valuation froth lead to immediate rejection.`;
    hypeDelta = -15;
    riskDelta = +20;
    moatDelta = -12;
  }

  return {
    interrogation_question: passed ? 'VERDICT: TERM SHEET AUTHORIZED' : 'VERDICT: EATEN & DISCARDED',
    hype_score_delta: hypeDelta,
    risk_factor_delta: riskDelta,
    moat_delta: moatDelta,
    critique_note: critiqueNote,
    round_complete: true,
    verdict_summary: verdictSummary,
  };
}

// Optional Gemini / LLM Caller
export async function callGeminiInterrogation(req: InterrogationRequest, apiKey: string): Promise<InterrogationResponse> {
  const prompt = `You are Vesper Prey, a hyper-intelligent, brutally ruthless Silicon Valley General Partner at Singularity Predator Capital.
You are conducting a dynamic 4-round interrogation of a startup founder.

Startup Name: ${req.startupName}
Category: ${req.category}
Elevator Pitch: ${req.elevatorPitch}
Traction: MRR ${req.traction.mrr}, MoM Growth ${req.traction.momGrowth}, Active Users ${req.traction.activeUsers}, Burn ${req.traction.burnRate}
Current Round: ${req.currentRound} of 4
Current Hype Score: ${req.currentHypeScore} / 100
Founder's Answer to previous question: "${req.founderAnswer || '(Initial Pitch Submission)'}"

Previous Transcript:
${req.history.map((h) => `Round ${h.round} - Question: ${h.question} | Answer: ${h.founderAnswer} | Note: ${h.critiqueNote}`).join('\n')}

INSTRUCTIONS:
1. Provide a piercing, ruthless critique of their answer in "critique_note".
2. If this is Round 1-4, ask the next interrogation question in "interrogation_question".
   - Round 1 asks about unit economics / CAC / procurement reality.
   - Round 2 attacks their moat / open source / Big Tech copying.
   - Round 3 attacks customer churn / concentration / vulnerability.
   - Round 4 is the final kill shot: Why should I write a $5M lead check today instead of letting you bleed?
3. If this is Round 5 (the final verdict following Round 4's answer), set "round_complete": true, "interrogation_question": "VERDICT: TERM SHEET AUTHORIZED" (if final score >= 80) or "VERDICT: EATEN & DISCARDED" (if < 80), and provide "verdict_summary".
4. Calculate deltas between -20 and +20 based strictly on whether their answer had hard numbers, defensibility, or vague hand-waving:
   - "hype_score_delta": integer (-20 to +20)
   - "risk_factor_delta": integer (-20 to +20)
   - "moat_delta": integer (-20 to +20)

Return strictly valid JSON with NO markdown codeblocks:
{
  "interrogation_question": "string",
  "hype_score_delta": 0,
  "risk_factor_delta": 0,
  "moat_delta": 0,
  "critique_note": "string",
  "round_complete": boolean,
  "verdict_summary": "string"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(rawText);
  return {
    interrogation_question: String(parsed.interrogation_question || ''),
    hype_score_delta: Number(parsed.hype_score_delta) || 0,
    risk_factor_delta: Number(parsed.risk_factor_delta) || 0,
    moat_delta: Number(parsed.moat_delta) || 0,
    critique_note: String(parsed.critique_note || ''),
    round_complete: Boolean(parsed.round_complete),
    verdict_summary: parsed.verdict_summary ? String(parsed.verdict_summary) : undefined,
  };
}
