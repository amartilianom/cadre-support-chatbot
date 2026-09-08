-- Cadre Support Chatbot — leads table (F3, D-09, D-11).
-- Run this in the Supabase SQL editor for your project.
-- Only name/email/excerpt/reason are stored — no conversation transcripts (data minimization).

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  excerpt    text,
  reason     text,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

-- The app writes leads server-side with the publishable key (anon role), which respects RLS.
-- Enable RLS and grant INSERT only — so the key can submit leads but can never read, update, or
-- delete them (least privilege). Reading leads is done from the Supabase dashboard.
alter table public.leads enable row level security;

drop policy if exists "public can submit leads" on public.leads;
create policy "public can submit leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Table-level privilege: RLS gates which rows may be inserted, but the anon role also needs the
-- INSERT grant (the two are separate in Postgres). INSERT only — no SELECT, so leads can't be read.
grant insert on public.leads to anon;
