create extension if not exists pgcrypto;

create table if not exists public.map_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  city text not null,
  video_links text not null,
  map_type text not null,
  notes text not null default '',
  source_page text not null default '/create' check (source_page = '/create'),
  created_at timestamptz not null,
  map_title text not null,
  place_count text not null,
  current_storage text not null,
  preferred_input text not null,
  received_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  email text not null default '',
  goal text not null,
  confusing text not null,
  feature text not null,
  notes text not null default '',
  source_page text not null default '/feedback' check (source_page = '/feedback'),
  created_at timestamptz not null,
  received_at timestamptz not null default now()
);

alter table public.map_requests enable row level security;
alter table public.map_requests force row level security;
alter table public.feedback enable row level security;
alter table public.feedback force row level security;

revoke all on table public.map_requests from public, anon, authenticated;
revoke all on table public.feedback from public, anon, authenticated;
grant insert on table public.map_requests to anon, authenticated;
grant insert on table public.feedback to anon, authenticated;

drop policy if exists "map requests are insert only" on public.map_requests;
create policy "map requests are insert only"
on public.map_requests
for insert
to anon, authenticated
with check (
  source_page = '/create'
  and length(email) between 3 and 320
  and length(city) between 1 and 200
  and length(video_links) between 1 and 20000
  and length(map_type) between 1 and 100
  and length(notes) <= 10000
  and length(map_title) between 1 and 200
);

drop policy if exists "feedback is insert only" on public.feedback;
create policy "feedback is insert only"
on public.feedback
for insert
to anon, authenticated
with check (
  source_page = '/feedback'
  and length(email) <= 320
  and length(goal) between 1 and 10000
  and length(confusing) between 1 and 10000
  and length(feature) between 1 and 200
  and length(notes) <= 20000
);
