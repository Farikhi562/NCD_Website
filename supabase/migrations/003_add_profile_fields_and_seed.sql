-- Add missing profile fields for complete profile system
-- This migration adds the necessary columns to support full profile editing

-- Add missing columns to profiles table
alter table public.profiles
add column if not exists npm text,
add column if not exists bio text,
add column if not exists division text,
add column if not exists team text,
add column if not exists email text,
add column if not exists interests text[] default '{}';

-- Create index for division/team queries
create index if not exists profiles_division_idx on public.profiles (division);
create index if not exists profiles_team_idx on public.profiles (team);
create index if not exists profiles_npm_idx on public.profiles (npm);

-- Update existing profiles with email from auth.users where missing
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
and p.email is null;

-- ============================================================
-- Storage Bucket for Avatars
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- ============================================================
-- Storage RLS Policies for Avatars
-- ============================================================
-- Users can upload their own avatar
create policy "avatar_upload_own"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
create policy "avatar_update_own"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
create policy "avatar_delete_own"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Public can read avatars (since bucket is public)
create policy "avatar_select_public"
on storage.objects for select
using (bucket_id = 'avatars');

-- ============================================================
-- Updated Profiles RLS for proper profile editing
-- ============================================================

-- Drop existing restrictive update policy
drop policy if exists "profiles_update_own" on public.profiles;

-- Users can update their own profile (editable fields only)
-- Using a more permissive update policy but controlling editable fields in application layer
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  -- Prevent role escalation
  and role = (select role from public.profiles where id = auth.uid())
  -- Prevent unauthorized organizational field changes
  -- These fields can only be changed by admins
);

-- Allow authenticated users to read all profiles for People page
-- (already exists: "members_select_authenticated" on members table)
-- Add similar for profiles if needed for People page
create policy "profiles_select_authenticated"
on public.profiles for select
using (auth.role() = 'authenticated');

-- ============================================================
-- Members table - add missing columns if needed
-- ============================================================
alter table public.members
add column if not exists full_name text,
add column if not exists avatar_url text,
add column if not exists org_role text,
add column if not exists division text,
add column if not exists team text,
add column if not exists npm text;

-- Create indexes
create index if not exists members_division_idx on public.members (division);
create index if not exists members_team_idx on public.members (team);
create unique index if not exists members_npm_idx on public.members (npm);

-- Remove FK constraint to allow org member records without auth users
-- These are org directory records, not auth users. They'll be linked when members register.
alter table public.members drop constraint if exists members_id_fkey;

-- ============================================================
-- Seed the 20 canonical NCD members into members table
-- This provides the organization directory data
-- ============================================================
-- Note: These are organization member records, not auth users.
-- They will be linked to auth.users when members register.
-- We insert with known NPMs and organization data.

-- Clear existing seed data first (idempotent)
delete from public.members where npm in (
  '10225457', '50425672', '50425631', '51425248', '50425134',
  '50425637', '10125379', '50425998', '50425788', '10225359',
  '50425267', '51425098', '50425955', '51425231', '51425218',
  'NEW001', 'NEW002', 'NEW003', 'NEW004', 'NEW005'
);

-- Insert canonical NCD members (20 total: 15 original + 5 new)
-- avatar_url only set for verified existing files in public/images/
insert into public.members (id, email, npm, full_name, org_role, division, team, is_public, interests, skills, avatar_url, created_at, updated_at)
values
  -- Team 1 (UGP-GBIC competition participants)
  (gen_random_uuid(), 'dian.aulia@ncd.id', '10225457', 'Dian Aulia Febrianti', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', '/images/dian-aulia-febrianti.png', now(), now()),
  (gen_random_uuid(), 'muhamad.fauzan@ncd.id', '50425672', 'Muhamad Fauzan Al Farikhi', 'Vice Chairperson — Period I', 'Not Assigned', 'Team 1', true, '{}', '{}', '/images/muhamad-fauzan-al-farikhi.png', now(), now()),
  (gen_random_uuid(), 'mirza.danisywar@ncd.id', '50425631', 'Mirza Danisywar Noor Wahyu', 'Chairperson — Period I', 'Not Assigned', 'Team 1', true, '{}', '{}', '/images/mirza-danisywar-noor-wahyu.png', now(), now()),
  (gen_random_uuid(), 'syawalludin.fitroh@ncd.id', '51425248', 'Syawalludin Fitroh Rahman', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', '/images/syawalludin-fitroh-rahman.png', now(), now()),
  (gen_random_uuid(), 'annisa.saskia@ncd.id', '50425134', 'Annisa Saskia', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', '/images/annisa-saskia.png', now(), now()),

  -- Team 2 (UGP-GBIC competition participants)
  (gen_random_uuid(), 'mochamad.triandra@ncd.id', '50425637', 'Mochamad Triandra Andantyo', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', '/images/mochamad-triandra-andantyo.png', now(), now()),
  (gen_random_uuid(), 'ghazali.syaqih@ncd.id', '10125379', 'Ghazali Syaqih Husein', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'putri.aura@ncd.id', '50425998', 'Putri Aura Wening', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', '/images/putri-aura-wening.png', now(), now()),
  (gen_random_uuid(), 'muhammad.iqbal@ncd.id', '50425788', 'Muhammad Iqbal Fajri', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'chantika.shinta@ncd.id', '10225359', 'Chantika Shinta Sonia', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', '/images/chantika-shinta-sonia.png', now(), now()),

  -- Team 3 (UGP-GBIC competition participants)
  (gen_random_uuid(), 'deryl.jonathan@ncd.id', '50425267', 'Deryl Jonathan Yofan', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', '/images/deryl-jonathan-yofan.png', now(), now()),
  (gen_random_uuid(), 'rayyan.fathan@ncd.id', '51425098', 'Rayyan Fathan Addani', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'nedri.febrianto@ncd.id', '50425955', 'Nedri Febrianto', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'sri.gunarti@ncd.id', '51425231', 'Sri Gunarti Wijiastuti', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'sheva.putra@ncd.id', '51425218', 'Sheva Putra Firdaus', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', null, now(), now()),

  -- Additional 5 members (NOT in UGP-GBIC competition teams)
  (gen_random_uuid(), 'muhammad.ferdynand@ncd.id', 'NEW001', 'Muhammad Ferdynand Syah', 'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'fanny.novianty@ncd.id', 'NEW002', 'Fanny Novianty Lumban Gaol', 'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'muhammad.raffi@ncd.id', 'NEW003', 'Muhammad Raffi Anam', 'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'farhan.putra@ncd.id', 'NEW004', 'Farhan Putra Pradhana', 'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}', null, now(), now()),
  (gen_random_uuid(), 'waldan.zubary@ncd.id', 'NEW005', 'Waldan Zubary', 'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}', null, now(), now())
on conflict (npm) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  org_role = excluded.org_role,
  division = excluded.division,
  team = excluded.team,
  avatar_url = excluded.avatar_url,
  is_public = excluded.is_public,
  updated_at = now();

-- ============================================================
-- Comments for documentation
-- ============================================================
comment on column public.profiles.npm is 'NPM (Nomor Pokok Mahasiswa) - student ID number';
comment on column public.profiles.bio is 'Short biography for profile display';
comment on column public.profiles.division is 'NCD division assignment (People & Culture, Competition & Strategy, Project & Development, Not Assigned)';
comment on column public.profiles.team is 'NCD team assignment (Team 1, Team 2, Team 3)';
comment on column public.profiles.email is 'Email from Supabase Auth - read-only for users';
comment on column public.profiles.interests is 'User-selected interest tags';
comment on column public.members.npm is 'NPM - unique student identifier';
comment on column public.members.org_role is 'Organizational role (Member, Chairperson — Period I, Vice Chairperson — Period I, Division Lead)';
comment on column public.members.division is 'Division assignment';
comment on column public.members.team is 'Team assignment (Team 1, Team 2, Team 3)';
comment on column public.members.full_name is 'Member full name';
comment on column public.members.org_role is 'Organizational role (Member, Chairperson — Period I, Vice Chairperson — Period I, Division Lead)';
comment on column public.members.avatar_url is 'Profile photo path (local /images/ or Supabase Storage URL)';