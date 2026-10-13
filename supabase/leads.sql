-- Paste this into Supabase → SQL Editor → New query → Run. Creates the table the calculator saves to.
create table if not exists public.leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null,
  consent      boolean not null default false,  -- ticked "send me early access" (CASL record)
  consent_text text,                            -- exact wording they agreed to
  category     text,                            -- what they make
  retail       numeric,
  cost         numeric,
  margin_pct   numeric,
  wholesale    numeric,
  user_agent   text
);

-- Lock it down: only the server (service role key) can read/write. No public access.
alter table public.leads enable row level security;
