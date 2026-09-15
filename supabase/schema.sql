-- Venture Predator: PostgreSQL Schema with Row Level Security & Realtime Subscriptions

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('founder', 'vc')),
  full_name TEXT NOT NULL,
  firm_or_startup TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_email TEXT NOT NULL,
  founder_twitter TEXT,
  category TEXT NOT NULL CHECK (category IN ('AI Agents', 'Cyber Warfare', 'BioTech / Longevity', 'Quantum Infra', 'Autonomous Robotics', 'FinTech / DeFi')),
  elevator_pitch TEXT NOT NULL,
  traction JSONB NOT NULL DEFAULT '{"mrr": "$0", "momGrowth": "0%", "activeUsers": "0", "burnRate": "$0"}'::jsonb,
  hype_score INTEGER NOT NULL DEFAULT 50,
  risk_score INTEGER NOT NULL DEFAULT 50,
  moat_score INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'eaten', 'pending')),
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  autopsy_critique TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Deal Offers (Soft Term Sheets) Table
CREATE TABLE IF NOT EXISTS deal_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  vc_name TEXT NOT NULL,
  vc_email TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  valuation_millions NUMERIC(10, 2) NOT NULL,
  check_size_millions NUMERIC(10, 2) NOT NULL,
  covenants TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Direct Intro Requests Table
CREATE TABLE IF NOT EXISTS direct_intros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  vc_name TEXT NOT NULL,
  vc_email TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  thesis_match_note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_intros ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for the demo pipeline
CREATE POLICY "Public read deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Public insert deals" ON deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update deals" ON deals FOR UPDATE USING (true);

CREATE POLICY "Public read deal offers" ON deal_offers FOR SELECT USING (true);
CREATE POLICY "Public insert deal offers" ON deal_offers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read direct intros" ON direct_intros FOR SELECT USING (true);
CREATE POLICY "Public insert direct intros" ON direct_intros FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
ALTER PUBLICATION supabase_realtime ADD TABLE deal_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_intros;
