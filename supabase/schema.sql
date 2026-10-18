-- Venture Predator — database schema
-- Run this whole file once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- Profiles (one row per signed-in Google account)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text check (role in ('founder', 'investor')),
  firm        text,
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by policies. security definer avoids recursive RLS on profiles.
create or replace function public.is_investor()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'investor'
  );
$$;

-- ---------------------------------------------------------------------------
-- Startups (a founder's dossier)
-- ---------------------------------------------------------------------------
create table if not exists public.startups (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users(id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 80),
  category       text not null,
  founder_name   text,
  founder_email  text,
  twitter        text,
  mrr            numeric not null default 0,
  mom_growth     numeric not null default 0,
  contracts      integer not null default 0,
  burn           numeric not null default 0,
  pitch          text not null check (char_length(pitch) between 1 and 3000),
  created_at     timestamptz not null default now()
);
create index if not exists startups_owner_idx on public.startups (owner_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Interrogations (one 4-round run). Written ONLY by the server (service role),
-- so scores and the verified flag can't be forged from the browser.
-- ---------------------------------------------------------------------------
create table if not exists public.interrogations (
  id            uuid primary key default gen_random_uuid(),
  startup_id    uuid not null references public.startups(id) on delete cascade,
  owner_id      uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  engine        text not null default 'preloaded' check (engine in ('gemini', 'preloaded')),
  turns         jsonb not null default '[]'::jsonb,
  final_score   integer,
  verdict       text check (verdict in ('verified', 'rejected')),
  autopsy       text,
  verified      boolean not null default false,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);
create index if not exists interrogations_owner_idx on public.interrogations (owner_id, created_at desc);
create index if not exists interrogations_verified_idx on public.interrogations (verified, final_score desc, completed_at desc);

-- ---------------------------------------------------------------------------
-- Investor actions
-- ---------------------------------------------------------------------------
create table if not exists public.term_sheets (
  id               uuid primary key default gen_random_uuid(),
  investor_id      uuid not null references auth.users(id) on delete cascade,
  interrogation_id uuid not null references public.interrogations(id) on delete cascade,
  startup_id       uuid not null references public.startups(id) on delete cascade,
  investor_name    text,
  investor_firm    text,
  pre_money        numeric not null check (pre_money > 0),
  check_size       numeric not null check (check_size > 0),
  covenants        text check (char_length(covenants) <= 2000),
  created_at       timestamptz not null default now()
);

create table if not exists public.intro_requests (
  id               uuid primary key default gen_random_uuid(),
  investor_id      uuid not null references auth.users(id) on delete cascade,
  interrogation_id uuid not null references public.interrogations(id) on delete cascade,
  startup_id       uuid not null references public.startups(id) on delete cascade,
  investor_name    text,
  investor_firm    text,
  message          text check (char_length(message) <= 1000),
  created_at       timestamptz not null default now(),
  unique (investor_id, interrogation_id)
);

-- Fill investor name/firm from the profile so founders see a trustworthy sender.
create or replace function public.fill_investor_identity()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  select coalesce(full_name, email), firm
    into new.investor_name, new.investor_firm
    from public.profiles where id = new.investor_id;
  return new;
end;
$$;

drop trigger if exists term_sheets_identity on public.term_sheets;
create trigger term_sheets_identity before insert on public.term_sheets
  for each row execute function public.fill_investor_identity();

drop trigger if exists intro_requests_identity on public.intro_requests;
create trigger intro_requests_identity before insert on public.intro_requests
  for each row execute function public.fill_investor_identity();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.startups        enable row level security;
alter table public.interrogations  enable row level security;
alter table public.term_sheets     enable row level security;
alter table public.intro_requests  enable row level security;

-- profiles: you see and edit only your own row
drop policy if exists "profiles read own"   on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles read own"   on public.profiles for select using (id = auth.uid());
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- startups: owner has full control; investors can read startups that passed
drop policy if exists "startups owner all"        on public.startups;
drop policy if exists "startups investor verified" on public.startups;
create policy "startups owner all" on public.startups
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "startups investor verified" on public.startups
  for select using (
    public.is_investor()
    and exists (select 1 from public.interrogations i where i.startup_id = startups.id and i.verified)
  );

-- interrogations: read-only from the browser. No insert/update policies on purpose.
drop policy if exists "interrogations owner read"       on public.interrogations;
drop policy if exists "interrogations investor verified" on public.interrogations;
create policy "interrogations owner read" on public.interrogations
  for select using (owner_id = auth.uid());
create policy "interrogations investor verified" on public.interrogations
  for select using (verified and public.is_investor());

-- term sheets: investors write/read their own; founders read ones sent to them
drop policy if exists "term sheets investor insert" on public.term_sheets;
drop policy if exists "term sheets investor read"   on public.term_sheets;
drop policy if exists "term sheets founder read"    on public.term_sheets;
create policy "term sheets investor insert" on public.term_sheets
  for insert with check (
    investor_id = auth.uid()
    and public.is_investor()
    and exists (select 1 from public.interrogations i where i.id = interrogation_id and i.verified and i.startup_id = term_sheets.startup_id)
  );
create policy "term sheets investor read" on public.term_sheets
  for select using (investor_id = auth.uid());
create policy "term sheets founder read" on public.term_sheets
  for select using (exists (select 1 from public.startups s where s.id = startup_id and s.owner_id = auth.uid()));

-- intro requests: same shape
drop policy if exists "intros investor insert" on public.intro_requests;
drop policy if exists "intros investor read"   on public.intro_requests;
drop policy if exists "intros founder read"    on public.intro_requests;
create policy "intros investor insert" on public.intro_requests
  for insert with check (
    investor_id = auth.uid()
    and public.is_investor()
    and exists (select 1 from public.interrogations i where i.id = interrogation_id and i.verified and i.startup_id = intro_requests.startup_id)
  );
create policy "intros investor read" on public.intro_requests
  for select using (investor_id = auth.uid());
create policy "intros founder read" on public.intro_requests
  for select using (exists (select 1 from public.startups s where s.id = startup_id and s.owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Public, anonymous-safe platform numbers for the landing page
-- ---------------------------------------------------------------------------
create or replace function public.platform_stats()
returns json
language sql
stable
security definer set search_path = public
as $$
  select json_build_object(
    'interrogations', (select count(*) from public.interrogations where status = 'completed'),
    'verified',       (select count(*) from public.interrogations where verified),
    'median_score',   (select coalesce(percentile_cont(0.5) within group (order by final_score), 0)
                         from public.interrogations where status = 'completed'),
    'capital_offered_m', (select coalesce(sum(check_size), 0) / 1000000 from public.term_sheets)
  );
$$;
grant execute on function public.platform_stats() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: stream new verified deals to the investor radar (RLS still applies)
-- ---------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.interrogations;
exception when duplicate_object then null;
end $$;
