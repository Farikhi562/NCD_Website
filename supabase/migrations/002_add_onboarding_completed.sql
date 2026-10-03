-- Add onboarding_completed field to profiles table
-- This tracks whether a user has completed the mandatory onboarding flow

alter table public.profiles
add column if not exists onboarding_completed boolean not null default false;

-- Create index for efficient querying of users who need onboarding
create index if not exists profiles_onboarding_idx on public.profiles (onboarding_completed) where onboarding_completed = false;

-- Update the handle_new_user function to set onboarding_completed to false by default
-- (already handled by default value, but explicit for clarity)

-- Add comment for documentation
comment on column public.profiles.onboarding_completed is 'Tracks whether the user has completed the mandatory onboarding flow';