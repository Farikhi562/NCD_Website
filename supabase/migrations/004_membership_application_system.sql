-- 004_membership_application_system.sql
-- NCD Membership Application System (spec D-05, F-04, F-18).
--
-- What this migration creates:
--   1. ncd_membership_config          single row holding max_members (31)
--   2. membership_applications        the application workflow (pending -> under_review -> approved/rejected)
--   3. email_outbox                   reliable record of the notification to nexatechlabs271@gmail.com
--   4. capacity + review RPCs         server-side, race-safe approval that enforces the hard cap
--   5. triggers                       reject applications when full; only approval may create a member
--   6. membership-verification bucket private storage for KRS/KTM with applicant + admin access
--   7. members hardening              no client-side member inserts; anon reads directory columns only
--
-- Rules enforced in the database (never only in the frontend):
--   * count(public.members) can never exceed ncd_membership_config.max_members
--   * a members row can only be created by approve_membership_application()
--   * KRS/KTM files are never publicly readable and never reachable from /people, /about or /projects
--
-- Idempotent: safe to re-run. Run once in the Supabase SQL Editor, or:
--   supabase db query --linked -f supabase/migrations/004_membership_application_system.sql
--
-- NOTE FOR FUTURE SEEDS: the members insert trigger blocks direct inserts.
-- To seed members later, first insert an approved membership_applications row for
-- them, or temporarily drop trigger "members_insert_guard" with a recorded reason.

-- ============================================================
-- 1) Capacity configuration
-- ============================================================
create table if not exists public.ncd_membership_config (
  id integer primary key check (id = 1),
  max_members integer not null check (max_members > 0),
  updated_at timestamptz not null default now()
);

insert into public.ncd_membership_config (id, max_members)
values (1, 31)
on conflict (id) do nothing;

alter table public.ncd_membership_config enable row level security;

drop policy if exists "ncd_membership_config_select" on public.ncd_membership_config;
create policy "ncd_membership_config_select"
  on public.ncd_membership_config for select
  using (true);
-- No INSERT/UPDATE/DELETE policy: only the table owner (SQL editor) or the
-- service role can change the maximum, so no client can raise the cap.

-- ============================================================
-- 2) Membership applications
-- ============================================================
create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  npm text not null,
  university text not null check (university = 'Universitas Gunadarma'),
  faculty text not null,
  study_program text not null,
  semester smallint not null check (semester between 1 and 14),
  email text not null,
  whatsapp text not null,
  motivation text not null,
  skills text not null,
  contribution text not null,
  document_type text not null check (document_type in ('KRS', 'KTM')),
  document_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'approved', 'rejected')),
  reviewer_id uuid,
  review_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  member_id uuid references public.members (id) on delete set null,
  created_at timestamptz not null default now()
);

-- One open application per applicant and per NPM (duplicates are a DB error,
-- not a UI concern). A rejected applicant may apply again (maintainer decision,
-- 2026-10-05); an approved applicant is already a member and is blocked by the
-- trigger in section 5.
create unique index if not exists membership_applications_user_open_key
  on public.membership_applications (user_id)
  where status in ('pending', 'under_review');

create unique index if not exists membership_applications_npm_open_key
  on public.membership_applications (npm)
  where status in ('pending', 'under_review');

create index if not exists membership_applications_status_idx
  on public.membership_applications (status, submitted_at desc);

alter table public.membership_applications enable row level security;

-- review_note and reviewer_id are internal: no client role receives SELECT on them.
revoke select on public.membership_applications from anon, authenticated;
revoke insert, update, delete on public.membership_applications from anon;
revoke update, delete on public.membership_applications from authenticated;
grant select (
  id, user_id, full_name, npm, university, faculty, study_program, semester,
  email, whatsapp, motivation, skills, contribution, document_type,
  document_path, status, submitted_at, reviewed_at, member_id, created_at
) on public.membership_applications to authenticated;

drop policy if exists "membership_applications_select_own_or_admin" on public.membership_applications;
create policy "membership_applications_select_own_or_admin"
  on public.membership_applications for select
  using (auth.uid() = user_id or public.current_user_role() = 'admin');

drop policy if exists "membership_applications_insert_own" on public.membership_applications;
create policy "membership_applications_insert_own"
  on public.membership_applications for insert
  with check (auth.uid() = user_id and status = 'pending');
-- No UPDATE / DELETE policy on purpose: status changes happen only through the
-- SECURITY DEFINER functions below, and applications are never deleted.

-- ============================================================
-- 3) Notification outbox
-- ============================================================
create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text not null,
  kind text not null default 'membership_application',
  related_application_id uuid references public.membership_applications (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists email_outbox_pending_idx
  on public.email_outbox (created_at)
  where status = 'pending';

alter table public.email_outbox enable row level security;
-- Deny by default: only the server (service role) reads or marks messages.
-- The queue trigger below is SECURITY DEFINER, so it can still insert.

-- ============================================================
-- 4) Functions
-- ============================================================

-- Capacity for the UI and the route handler. Remaining slots are calculated by
-- the caller: remaining_slots = max_members - confirmed_members.
create or replace function public.ncd_membership_capacity()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'max_members', cfg.max_members,
    'confirmed_members', (select count(*) from public.members)
  )
  from public.ncd_membership_config cfg
  where cfg.id = 1;
$$;

-- Approve: creates the official member. Race-safe via an advisory lock, so two
-- admins can never take the same last slot (31 -> 32 -> 33).
create or replace function public.approve_membership_application(
  p_application_id uuid,
  p_review_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app public.membership_applications%rowtype;
  v_max integer;
  v_confirmed integer;
  v_member_id uuid;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only NCD administrators can review membership applications.';
  end if;

  -- serialize every approval so capacity is checked against a stable count
  perform pg_advisory_xact_lock(hashtext('ncd_membership_capacity'));

  select * into v_app
    from public.membership_applications
   where id = p_application_id
     for update;

  if not found then
    raise exception 'Membership application not found.';
  end if;

  if v_app.status not in ('pending', 'under_review') then
    raise exception 'This application has already been reviewed (status: %).', v_app.status;
  end if;

  select cfg.max_members into v_max from public.ncd_membership_config cfg where cfg.id = 1;
  select count(*) into v_confirmed from public.members;

  if v_max is null then
    raise exception 'Membership capacity is not configured.';
  end if;

  if v_confirmed >= v_max then
    raise exception 'Membership capacity has been reached. This application cannot be approved at this time.';
  end if;

  if exists (
    select 1 from public.members m
     where m.id = v_app.user_id
        or (v_app.npm is not null and m.npm = v_app.npm)
  ) then
    raise exception 'An NCD member record already exists for this applicant.';
  end if;

  -- Mark approved first: the members insert trigger verifies this row.
  update public.membership_applications
     set status = 'approved',
         reviewer_id = auth.uid(),
         review_note = p_review_note,
         reviewed_at = now()
   where id = v_app.id;

  begin
    insert into public.members (
      id, email, npm, full_name, org_role, division, team, is_public, skills, interests
    ) values (
      v_app.user_id, null, v_app.npm, v_app.full_name,
      'Member', 'Not Assigned', 'Not Assigned', true, '{}', '{}'
    )
    returning id into v_member_id;
  exception when unique_violation then
    raise exception 'An NCD member record already exists for this applicant.';
  end;

  update public.membership_applications
     set member_id = v_member_id
   where id = v_app.id;

  -- The real address belongs on the private profile, never on the public directory row.
  update public.profiles
     set email = coalesce(email, v_app.email)
   where id = v_app.user_id;

  select count(*) into v_confirmed from public.members;

  return jsonb_build_object(
    'application_id', v_app.id,
    'status', 'approved',
    'member_id', v_member_id,
    'max_members', v_max,
    'confirmed_members', v_confirmed
  );
end;
$$;

-- Reject: keeps the record for history, creates no member, touches no account.
create or replace function public.reject_membership_application(
  p_application_id uuid,
  p_review_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app public.membership_applications%rowtype;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only NCD administrators can review membership applications.';
  end if;

  select * into v_app
    from public.membership_applications
   where id = p_application_id
     for update;

  if not found then
    raise exception 'Membership application not found.';
  end if;

  if v_app.status not in ('pending', 'under_review') then
    raise exception 'This application has already been reviewed (status: %).', v_app.status;
  end if;

  update public.membership_applications
     set status = 'rejected',
         reviewer_id = auth.uid(),
         review_note = nullif(trim(coalesce(p_review_note, '')), ''),
         reviewed_at = now()
   where id = v_app.id;

  return jsonb_build_object('application_id', v_app.id, 'status', 'rejected');
end;
$$;

-- pending -> under_review
create or replace function public.set_application_under_review(p_application_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app public.membership_applications%rowtype;
begin
  if public.current_user_role() is distinct from 'admin' then
    raise exception 'Only NCD administrators can review membership applications.';
  end if;

  select * into v_app
    from public.membership_applications
   where id = p_application_id
     for update;

  if not found then
    raise exception 'Membership application not found.';
  end if;

  if v_app.status <> 'pending' then
    raise exception 'Only pending applications can be marked under review (status: %).', v_app.status;
  end if;

  update public.membership_applications
     set status = 'under_review',
         reviewer_id = auth.uid(),
         reviewed_at = now()
   where id = v_app.id;

  return jsonb_build_object('application_id', v_app.id, 'status', 'under_review');
end;
$$;

-- ============================================================
-- 5) Triggers
-- ============================================================

-- 5a. New applications: reject when full, reject existing members, force the
--     document into the applicant's own private folder.
create or replace function public.enforce_membership_application_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_max integer;
  v_confirmed integer;
begin
  if new.status <> 'pending' then
    raise exception 'A new membership application must start as pending.';
  end if;

  select cfg.max_members into v_max from public.ncd_membership_config cfg where cfg.id = 1;
  select count(*) into v_confirmed from public.members;

  if v_max is null then
    raise exception 'Membership capacity is not configured.';
  end if;

  if v_confirmed >= v_max then
    raise exception 'NCD membership is currently full.';
  end if;

  if exists (
    select 1 from public.members m
     where m.id = new.user_id
        or (m.npm is not null and m.npm = new.npm)
  ) then
    raise exception 'This applicant is already an NCD member.';
  end if;

  if left(new.document_path, length(new.user_id::text) + 1) <> new.user_id::text || '/' then
    raise exception 'The verification document must be stored in the applicant''s own private folder.';
  end if;

  return new;
end;
$$;

drop trigger if exists membership_applications_insert_guard on public.membership_applications;
create trigger membership_applications_insert_guard
  before insert on public.membership_applications
  for each row execute function public.enforce_membership_application_rules();

-- 5b. Members: only an approval may create a member, and never past the cap.
create or replace function public.enforce_member_creation_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_max integer;
  v_confirmed integer;
begin
  -- Upsert-style refresh of a row that already exists is an update, not a new member.
  if exists (select 1 from public.members m where m.id = new.id) then
    return new;
  end if;

  if not exists (
    select 1 from public.membership_applications a
     where a.status = 'approved'
       and (a.user_id = new.id or (a.npm is not null and a.npm = new.npm))
  ) then
    raise exception 'NCD members can only be created by approving a membership application.';
  end if;

  select cfg.max_members into v_max from public.ncd_membership_config cfg where cfg.id = 1;
  select count(*) into v_confirmed from public.members;

  if v_max is null then
    raise exception 'Membership capacity is not configured.';
  end if;

  if v_confirmed >= v_max then
    raise exception 'Membership capacity has been reached.';
  end if;

  return new;
end;
$$;

drop trigger if exists members_insert_guard on public.members;
create trigger members_insert_guard
  before insert on public.members
  for each row execute function public.enforce_member_creation_rules();

-- 5c. Notification: every application is recorded for nexatechlabs271@gmail.com
--     in the same transaction as the application itself.
create or replace function public.queue_membership_application_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.email_outbox (recipient, subject, kind, related_application_id)
  values (
    'nexatechlabs271@gmail.com',
    'New NCD Membership Application',
    'membership_application',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists membership_applications_notify on public.membership_applications;
create trigger membership_applications_notify
  after insert on public.membership_applications
  for each row execute function public.queue_membership_application_notification();

-- ============================================================
-- 6) Grants for the RPCs (deny by default, then grant deliberately)
-- ============================================================
revoke execute on function public.ncd_membership_capacity() from public;
revoke execute on function public.approve_membership_application(uuid, text) from public;
revoke execute on function public.reject_membership_application(uuid, text) from public;
revoke execute on function public.set_application_under_review(uuid) from public;

grant execute on function public.ncd_membership_capacity() to anon, authenticated, service_role;
grant execute on function public.approve_membership_application(uuid, text) to authenticated, service_role;
grant execute on function public.reject_membership_application(uuid, text) to authenticated, service_role;
grant execute on function public.set_application_under_review(uuid) to authenticated, service_role;

-- ============================================================
-- 7) Private bucket for KRS / KTM
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('membership-verification', 'membership-verification', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- Applicant uploads/overwrites their own folder only.
drop policy if exists "membership_doc_insert_own" on storage.objects;
create policy "membership_doc_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'membership-verification'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "membership_doc_update_own" on storage.objects;
create policy "membership_doc_update_own"
  on storage.objects for update
  using (
    bucket_id = 'membership-verification'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Read: own documents, or any document for an NCD administrator.
-- No DELETE policy: verification documents are kept for the record.
drop policy if exists "membership_doc_select_own_or_admin" on storage.objects;
create policy "membership_doc_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'membership-verification'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.current_user_role() = 'admin'
    )
  );

-- ============================================================
-- 8) members hardening (privacy + membership integrity)
-- ============================================================

-- Approved members must not carry a publicly readable address (members is
-- readable by anyone holding the anon key); their real address lives on the
-- RLS-protected profile.
do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'members'
       and column_name = 'email'
       and is_nullable = 'NO'
  ) then
    alter table public.members alter column email drop not null;
  end if;
end $$;

-- Members are created by approve_membership_application() only.
drop policy if exists "members_upsert_own" on public.members;

-- The public directory exposes exactly the columns the UI is allowed to show:
-- no npm, no email for anonymous readers.
revoke select on public.members from anon;
grant select (
  id, full_name, avatar_url, org_role, division, team, is_public,
  interests, skills, learning_targets, cohort, major, created_at, updated_at
) on public.members to anon;
