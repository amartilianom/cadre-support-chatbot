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

-- Leads are written server-side with the service-role key (which bypasses RLS).
-- Enable RLS with no public policy so the anon key can neither read nor write leads.
alter table public.leads enable row level security;
