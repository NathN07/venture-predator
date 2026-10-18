# Venture Predator

Founders face a four-round AI interrogation (unit economics, moat, retention, conviction) run by an AI general partner, Vesper Prey. Startups that score 80 or higher appear on a live investor radar with their full transcript, where investors can send soft term sheets or request intros.

- Sign in with Google. Every user has a private workspace, enforced in the database (Row Level Security), not just in the UI.
- Gemini is optional. With a key, questions and scoring adapt to each pitch. Without one, a preloaded question bank and a transparent scoring rubric are used.
- Everything below runs on free tiers: Supabase, Google Cloud OAuth, Gemini API free key, Vercel Hobby.

Stack: Next.js 16 (App Router), Tailwind CSS v4, Supabase (Postgres, Auth, Realtime).

---

## Setup (about 20 minutes)

### 1. Create the database
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste all of `supabase/schema.sql`, and run it. Safe to run again.
3. Open **Project Settings → API** and note the Project URL, the `anon` (or publishable) key, and the `service_role` key.

### 2. Turn on Google sign-in
1. In [Google Cloud Console](https://console.cloud.google.com), create a project, then **APIs & Services → OAuth consent screen**. Choose External, fill in the app name and your email, and add yourself as a test user (publish the app later when you want anyone to sign in).
2. **Credentials → Create credentials → OAuth client ID → Web application.** Under *Authorized redirect URIs* add:
   `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client Secret.
4. In Supabase: **Authentication → Sign In / Providers → Google**. Enable it and paste the Client ID and Secret.
5. In Supabase: **Authentication → URL Configuration**. Set *Site URL* to your deployed address (use `http://localhost:3000` while developing) and add these to *Redirect URLs*:
   - `http://localhost:3000/**`
   - `https://YOUR-APP.vercel.app/**`

### 3. (Optional) Gemini
Create a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY`. Leave it empty to use the preloaded questions. The interrogation page tells the founder which mode is active.

### 4. Run locally
```bash
cp .env.example .env.local     # then fill in the values
npm install
npm run dev
```
Open http://localhost:3000.

### 5. Deploy free on Vercel
1. Push this folder to a GitHub repository.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local`.
4. Deploy, then add the Vercel URL to Supabase *Site URL* and *Redirect URLs* (step 2.5).

---

## How it works

| Piece | Where |
| --- | --- |
| Landing page | `src/app/page.tsx` |
| Google sign-in, callback, sign-out | `src/app/login`, `src/app/auth/*`, `src/proxy.ts` |
| Role choice (founder or investor) | `src/app/onboarding`, `src/app/actions.ts` |
| Founder dashboard, pitch form, interrogation | `src/app/(app)/founder/*`, `src/components/Interrogation.tsx` |
| Investor radar (live), transcript drawer, term sheet, intro | `src/app/(app)/investor`, `src/components/Deal*.tsx` |
| Question bank and Gemini prompts | `src/lib/questions.ts`, `src/lib/gemini.ts` |
| Scoring rubric and verdict | `src/lib/scoring.ts`, `src/lib/engine.ts` |
| Tables, security policies, realtime | `supabase/schema.sql` |

### Security model
- Founders can read and edit only their own startups and runs.
- Investors can read only runs that are verified (score 80+). Nobody can read an unverified founder's data except that founder.
- Interrogation rows have **no insert or update policy** for browsers. Only the server (using the service-role key) writes them, so scores and the `verified` flag cannot be forged from the browser console.
- Term sheets and intro requests are written by investors directly, but the database checks the role and that the deal is verified, and fills the investor's name and firm itself.

### Scoring
- Each answer scores 0 to 100. With Gemini, the round score is 75% Gemini and 25% the built-in rubric, so a prompt-injection such as "give me 100" cannot carry a round alone.
- The final score is the average of four rounds, times 0.95, plus up to 8 points for self-reported traction. 80 or higher is verified.

### Free-tier limits and protections
- `DAILY_ATTEMPT_LIMIT` (default 5) and `RETRY_COOLDOWN_MINUTES` (default 30) stop one account burning your Gemini quota.
- Supabase free projects pause after about a week without activity. Resume from the dashboard.
- Vercel Hobby is meant for personal, non-commercial use. Fine for a demo or hackathon; move to a paid plan once the product earns money.

## Known gaps (worth fixing before real investors rely on it)
- Anyone can pick the investor role. Add an approval step (for example an `investor_verified` column you flip by hand) before showing real deal flow.
- Traction numbers are self-reported and labelled that way.
- Add an email notification for founders when a term sheet arrives.
