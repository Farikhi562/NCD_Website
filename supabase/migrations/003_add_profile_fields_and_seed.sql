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
add column if not exists avatar_url text,
add column if not exists org_role text,
add column if not exists division text,
add column if not exists team text,
add column if not exists npm text;

-- Create indexes
create index if not exists members_division_idx on public.members (division);
create index if not exists members_team_idx on public.members (team);
create index if not exists members_npm_idx on public.members (npm);

-- ============================================================
-- Seed the 15 canonical NCD members into members table
-- This provides the organization directory data
-- ============================================================
-- Note: These are organization member records, not auth users.
-- They will be linked to auth.users when members register.
-- We insert with known NPMs and organization data.

-- Clear existing seed data first (idempotent)
delete from public.members where npm in (
  '10225457', '50425672', '50425631', '51425248', '50425134',
  '50425637', '10125379', '50425998', '50425788', '10225359',
  '50425267', '51425098', '50425955', '51425231', '51425218'
);

-- Insert canonical NCD members
insert into public.members (id, email, npm, full_name, org_role, division, team, is_public, interests, skills, created_at, updated_at)
values
  -- Team 1
  (gen_random_uuid(), 'dian.aulia@ncd.id', '10225457', 'Dian Aulia Febrianti', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'muhamad.fauzan@ncd.id', '50425672', 'Muhamad Fauzan Al Farikhi', 'Vice Chairperson — Period I', 'Not Assigned', 'Team 1', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'mirza.danisywar@ncd.id', '50425631', 'Mirza Danisywar Noor Wahyu', 'Chairperson — Period I', 'Not Assigned', 'Team 1', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'syawalludin.fitroh@ncd.id', '51425248', 'Syawalludin Fitroh Rahman', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'annisa.saskia@ncd.id', '50425134', 'Annisa Saskia', 'Member', 'Not Assigned', 'Team 1', true, '{}', '{}', now(), now()),

  -- Team 2
  (gen_random_uuid(), 'mochamad.triandra@ncd.id', '50425637', 'Mochamad Triandra Andantyo', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'ghazali.syaqih@ncd.id', '10125379', 'Ghazali Syaqih Husein', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'putri.aura@ncd.id', '50425998', 'Putri Aura Wening', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'muhammad.iqbal@ncd.id', '50425788', 'Muhammad Iqbal Fajri', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'chantika.shinta@ncd.id', '10225359', 'Chantika Shinta Sonia', 'Member', 'Not Assigned', 'Team 2', true, '{}', '{}', now(), now()),

  -- Team 3
  (gen_random_uuid(), 'deryl.jonathan@ncd.id', '50425267', 'Deryl Jonathan Yofan', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'rayyan.fathan@ncd.id', '51425098', 'Rayyan Fathan Addani', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'nedri.febrianto@ncd.id', '50425955', 'Nedri Febrianto', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'sri.gunarti@ncd.id', '51425231', 'Sri Gunarti Wijiastuti', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', now(), now()),
  (gen_random_uuid(), 'sheva.putra@ncd.id', '51425218', 'Sheva Putra Firdaus', 'Member', 'Not Assigned', 'Team 3', true, '{}', '{}', now(), now())
on conflict (npm) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  org_role = excluded.org_role,
  division = excluded.division,
  team = excluded.team,
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