create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  department text not null check (department in ('IT','HTM','Technology','Education','Engineering')),
  to_name text not null check (char_length(to_name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 800),
  from_name text not null default 'Anonymous' check (char_length(from_name) <= 80),
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  approved_at timestamptz
);
alter table public.messages add column if not exists archived_at timestamptz;
alter table public.messages add column if not exists approved_at timestamptz;
create index if not exists messages_dept_idx on public.messages (department, created_at desc);

alter table public.messages enable row level security;
-- Public submissions remain pending; only the admin API can approve them.
drop policy if exists "public insert" on public.messages;
create policy "public insert" on public.messages for insert to anon
  with check (approved_at is null and archived_at is null);
drop policy if exists "public read" on public.messages;
create policy "public read" on public.messages for select to anon
  using (approved_at is not null and archived_at is null);

-- Optional: live updates on the projector
alter publication supabase_realtime add table public.messages;
