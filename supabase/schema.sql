create extension if not exists pgcrypto;

create table if not exists public.clip2map_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  city text not null default '',
  "videoLinks" text not null default '',
  "mapType" text not null default '',
  notes text not null default '',
  "sourcePage" text not null check ("sourcePage" in ('/create', '/feedback')),
  "createdAt" timestamptz not null,
  "submissionType" text not null check ("submissionType" in ('map_request', 'product_feedback')),
  "mapTitle" text,
  "placeCount" text,
  "currentStorage" text,
  "preferredInput" text,
  goal text,
  confusing text,
  feature text,
  received_at timestamptz not null default now()
);

alter table public.clip2map_submissions enable row level security;

revoke all on table public.clip2map_submissions from anon, authenticated;
grant insert on table public.clip2map_submissions to anon, authenticated;

drop policy if exists "validation submissions are insert only" on public.clip2map_submissions;
create policy "validation submissions are insert only"
on public.clip2map_submissions
for insert
to anon, authenticated
with check (
  length(email) <= 320
  and length(city) <= 200
  and length("videoLinks") <= 20000
  and length(notes) <= 10000
);
