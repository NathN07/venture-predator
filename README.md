# Venture Predator

An AI VC Simulator — pitch a startup to Vesper Prey, a ruthless AI venture capitalist, survive 3 rapid-fire follow-up questions, and walk out with a term sheet or a brutal (shareable) rejection.

Built for the **Prompt Predators** hackathon team.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (radar gauge + transitions)
- `@google/generative-ai` calling Gemini server-side via `/api/vc`

## Run locally

```bash
npm install
cp .env.local.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000. Get a free key at https://aistudio.google.com/apikey (no credit card needed).

## Deploy (Vercel — fastest path)

```bash
npm i -g vercel
vercel
```

Then add `GEMINI_API_KEY` in the Vercel project's Environment Variables settings and redeploy.

## Architecture

```
src/
  app/
    page.tsx             -> orchestrates phase state: pitch -> interrogating -> verdict
    api/vc/route.ts       -> POST endpoint, calls Gemini, returns strict JSON
    globals.css           -> design tokens (colors, fonts) via Tailwind v4 @theme
  lib/
    vcPersona.ts          -> system prompt + JSON contract for the VC persona
    gemini.ts             -> Gemini client wrapper, defensive JSON parsing + 1 retry
    types.ts              -> shared types / API contract
  components/
    PitchForm.tsx         -> elevator pitch intake
    VCQuestionCard.tsx    -> interrogation round UI
    RadarGauge.tsx        -> signature live metric visual (Hype / Risk / Interest)
    TermSheet.tsx         -> final verdict reveal
```

**State is intentionally simple**: one `useState` tree in `page.tsx`, no global store. Each turn POSTs the full startup info + Q&A history to `/api/vc`, which asks Gemini to return one of two strict JSON shapes (`question` or `verdict`) — see `lib/vcPersona.ts` for the exact contract. The API route never talks to the client — the browser never sees your API key.

## Design direction

Dark, "term sheet meets interrogation room" identity — not the generic neon-on-black AI look. Fraunces (display serif) for verdict/headline moments, IBM Plex Sans/Mono for the interrogation and data readouts. Signature element is the radar gauge: three arms (Hype/Risk/Interest) sweeping like a predator tracking prey, live-animated with Framer Motion springs.

## Where to extend next

- Persist sessions (currently everything lives in React state — refresh loses progress)
- Stream the VC's response token-by-token instead of waiting for the full JSON
- Add a leaderboard of funded pitches (needs a DB — Vercel Postgres or Supabase are fastest to wire up)
- Voice input for the pitch/answers if you want an extra wow-factor for judges
