create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  department text not null check (department in ('IT','HTM','Technology','Education','Engineering')),
  to_name text not null check (char_length(to_name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 800),
  from_name text not null default 'Anonymous' check (char_length(from_name) <= 80),
  created_at timestamptz not null default now()
);
create index if not exists messages_dept_idx on public.messages (department, created_at desc);

alter table public.messages enable row level security;
-- Public can submit and read (for the projector). Edit/delete happen only through
-- /api/admin using the service-role key, which bypasses RLS.
create policy "public insert" on public.messages for insert to anon with check (true);
create policy "public read"   on public.messages for select to anon using (true);

-- Optional: live updates on the projector
alter publication supabase_realtime add table public.messages;
