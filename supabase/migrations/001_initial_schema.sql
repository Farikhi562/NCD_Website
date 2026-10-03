-- NCD Website Database Schema — Phase 2 MVP
-- Run this in Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin', 'treasurer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'member');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Members (extended profile info for directory)
-- ============================================================
create table public.members (
  id uuid primary key references public.profiles(id) on delete cascade,
  email text not null,
  cohort text,
  major text,
  skills text[] default '{}',
  interests text[] default '{}',
  learning_targets text[] default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger members_updated_at
  before update on public.members
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Activities
-- ============================================================
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date date not null,
  location text,
  cover_image text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index activities_date_idx on public.activities (date desc);
create trigger activities_updated_at
  before update on public.activities
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Projects
-- ============================================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  problem text,
  research text,
  solution text,
  outcome text,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  start_date date,
  end_date date,
  cover_image text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_status_idx on public.projects (status);
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Competitions
-- ============================================================
create table public.competitions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  organizer text,
  category text,
  registration_deadline date,
  competition_date date,
  link text,
  status text not null default 'tracking' check (status in ('tracking', 'registered', 'participating', 'completed', 'missed')),
  brief text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index competitions_status_idx on public.competitions (status);
create index competitions_date_idx on public.competitions (competition_date);
create trigger competitions_updated_at
  before update on public.competitions
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Knowledge Articles
-- ============================================================
create table public.knowledge_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null, -- Markdown
  excerpt text,
  cover_image text,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid not null references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index knowledge_status_idx on public.knowledge_articles (status);
create index knowledge_published_idx on public.knowledge_articles (published_at desc) where status = 'published';
create trigger knowledge_articles_updated_at
  before update on public.knowledge_articles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Kas Transactions (Financial Ledger)
-- ============================================================
create table public.kas_transactions (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  description text not null,
  income bigint not null default 0, -- stored in smallest unit (rupiah)
  expense bigint not null default 0,
  balance bigint not null, -- running balance after this transaction
  category text,
  reference text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kas_date_idx on public.kas_transactions (date desc, created_at desc);
create trigger kas_transactions_updated_at
  before update on public.kas_transactions
  for each row execute procedure public.handle_updated_at();

-- Function to calculate running balance
create or replace function public.calculate_kas_balance(new_date date, new_income bigint, new_expense bigint)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  last_balance bigint;
begin
  select coalesce(balance, 0) into last_balance
  from public.kas_transactions
  where date < new_date
     or (date = new_date and created_at < now()) -- approximate ordering
  order by date desc, created_at desc
  limit 1;

  return coalesce(last_balance, 0) + new_income - new_expense;
end;
$$;

-- Trigger to auto-calculate balance on insert
create or replace function public.set_kas_balance()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.balance = public.calculate_kas_balance(new.date, new.income, new.expense);
  return new;
end;
$$;

drop trigger if exists kas_set_balance on public.kas_transactions;
create trigger kas_set_balance
  before insert on public.kas_transactions
  for each row execute procedure public.set_kas_balance();

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.activities enable row level security;
alter table public.projects enable row level security;
alter table public.competitions enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.kas_transactions enable row level security;

-- Helper function: get current user's role
create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Helper function: is current user admin or treasurer
create or replace function public.current_user_is_privileged()
returns boolean language sql stable security definer set search_path = public as $$
  select role in ('admin', 'treasurer') from public.profiles where id = auth.uid();
$$;

-- ============================================================
-- Profiles RLS
-- ============================================================
-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "profiles_select_admin"
  on public.profiles for select
  using (public.current_user_role() = 'admin');

-- Users can update their own profile (except role)
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Admins can update any profile (including role)
create policy "profiles_update_admin"
  on public.profiles for update
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ============================================================
-- Members RLS
-- ============================================================
-- Public can read public members
create policy "members_select_public"
  on public.members for select
  using (is_public = true);

-- Authenticated users can read all members
create policy "members_select_authenticated"
  on public.members for select
  using (auth.role() = 'authenticated');

-- Users can manage their own member record
create policy "members_upsert_own"
  on public.members for insert
  with check (auth.uid() = id);

create policy "members_update_own"
  on public.members for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can manage all members
create policy "members_all_admin"
  on public.members for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ============================================================
-- Activities RLS
-- ============================================================
-- Public can read published activities (if we add published flag later)
-- For now: authenticated users can read all
create policy "activities_select_authenticated"
  on public.activities for select
  using (auth.role() = 'authenticated');

-- Authenticated users can create activities
create policy "activities_insert_authenticated"
  on public.activities for insert
  with check (auth.role() = 'authenticated' and created_by = auth.uid());

-- Creators and admins can update
create policy "activities_update_creator_or_admin"
  on public.activities for update
  using (created_by = auth.uid() or public.current_user_role() = 'admin')
  with check (created_by = auth.uid() or public.current_user_role() = 'admin');

-- Creators and admins can delete
create policy "activities_delete_creator_or_admin"
  on public.activities for delete
  using (created_by = auth.uid() or public.current_user_role() = 'admin');

-- ============================================================
-- Projects RLS
-- ============================================================
create policy "projects_select_authenticated"
  on public.projects for select
  using (auth.role() = 'authenticated');

create policy "projects_insert_authenticated"
  on public.projects for insert
  with check (auth.role() = 'authenticated' and created_by = auth.uid());

create policy "projects_update_creator_or_admin"
  on public.projects for update
  using (created_by = auth.uid() or public.current_user_role() = 'admin')
  with check (created_by = auth.uid() or public.current_user_role() = 'admin');

create policy "projects_delete_creator_or_admin"
  on public.projects for delete
  using (created_by = auth.uid() or public.current_user_role() = 'admin');

-- ============================================================
-- Competitions RLS
-- ============================================================
create policy "competitions_select_authenticated"
  on public.competitions for select
  using (auth.role() = 'authenticated');

create policy "competitions_insert_authenticated"
  on public.competitions for insert
  with check (auth.role() = 'authenticated' and created_by = auth.uid());

create policy "competitions_update_creator_or_admin"
  on public.competitions for update
  using (created_by = auth.uid() or public.current_user_role() = 'admin')
  with check (created_by = auth.uid() or public.current_user_role() = 'admin');

create policy "competitions_delete_creator_or_admin"
  on public.competitions for delete
  using (created_by = auth.uid() or public.current_user_role() = 'admin');

-- ============================================================
-- Knowledge Articles RLS
-- ============================================================
-- Public can read published articles
create policy "knowledge_select_published"
  on public.knowledge_articles for select
  using (status = 'published');

-- Authenticated users can read all articles
create policy "knowledge_select_authenticated"
  on public.knowledge_articles for select
  using (auth.role() = 'authenticated');

-- Authenticated users can create drafts
create policy "knowledge_insert_authenticated"
  on public.knowledge_articles for insert
  with check (auth.role() = 'authenticated' and author_id = auth.uid() and status = 'draft');

-- Authors and admins can update
create policy "knowledge_update_author_or_admin"
  on public.knowledge_articles for update
  using (author_id = auth.uid() or public.current_user_role() = 'admin')
  with check (author_id = auth.uid() or public.current_user_role() = 'admin');

-- Authors and admins can delete
create policy "knowledge_delete_author_or_admin"
  on public.knowledge_articles for delete
  using (author_id = auth.uid() or public.current_user_role() = 'admin');

-- ============================================================
-- Kas Transactions RLS — Critical for financial privacy
-- ============================================================
-- PUBLIC VIEW: Only aggregated summary via transparency page (no direct table access)
-- No public select policy on kas_transactions table

-- AUTHENTICATED VIEW: Members can read all transactions
create policy "kas_select_authenticated"
  on public.kas_transactions for select
  using (auth.role() = 'authenticated');

-- ADMIN/TREASURER VIEW: Can insert/update/delete
create policy "kas_insert_privileged"
  on public.kas_transactions for insert
  with check (public.current_user_is_privileged() and created_by = auth.uid());

create policy "kas_update_privileged"
  on public.kas_transactions for update
  using (public.current_user_is_privileged())
  with check (public.current_user_is_privileged());

create policy "kas_delete_privileged"
  on public.kas_transactions for delete
  using (public.current_user_is_privileged());

-- ============================================================
-- Storage Buckets (for future use)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);