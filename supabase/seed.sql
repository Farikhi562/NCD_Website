-- Development seed data for NCD Website
-- Run after migrations in Supabase SQL Editor
-- NOTE: Only run in development!

-- Create test users via Supabase Auth Dashboard first, then link profiles
-- This seed assumes users exist in auth.users

-- Example: Update role for a specific user (replace with actual user ID)
-- update public.profiles set role = 'admin' where id = 'your-user-id-here';
-- update public.profiles set role = 'treasurer' where id = 'another-user-id-here';

-- Sample members (link to existing profiles)
-- insert into public.members (id, email, cohort, major, skills, interests, learning_targets, is_public)
-- values
--   ('user-id-1', 'alice@ncd.id', '2023', 'Computer Science', ARRAY['React', 'TypeScript', 'Node.js'], ARRAY['Web Dev', 'AI'], ARRAY['System Design'], true),
--   ('user-id-2', 'bob@ncd.id', '2024', 'Information Systems', ARRAY['Python', 'Data Analysis'], ARRAY['ML', 'Data Viz'], ARRAY['Deep Learning'], true);

-- Sample Kas transactions (for testing balance calculation)
-- insert into public.kas_transactions (date, description, income, expense, category, reference, created_by)
-- values
--   ('2024-01-15', 'Initial funding from sponsor', 5000000, 0, 'Sponsorship', 'INV-001', 'treasurer-user-id'),
--   ('2024-01-20', 'Domain renewal', 0, 200000, 'Operations', 'REC-001', 'treasurer-user-id'),
--   ('2024-02-01', 'Event venue deposit', 0, 1500000, 'Event', 'REC-002', 'treasurer-user-id'),
--   ('2024-02-10', 'Workshop ticket sales', 3000000, 0, 'Revenue', 'INV-002', 'treasurer-user-id');

-- Sample activities
-- insert into public.activities (title, description, date, location, created_by)
-- values
--   ('Kickoff Meeting 2024', 'First meeting of the semester', '2024-01-10', 'Lab Room 301', 'admin-user-id'),
--   ('React Workshop', 'Introduction to React and TypeScript', '2024-02-15', 'Online', 'admin-user-id');

-- Sample projects
-- insert into public.projects (title, description, problem, research, solution, outcome, status, start_date, end_date, created_by)
-- values
--   ('NCD Website', 'Digital home of NCD', 'Need a central platform', 'Evaluated Next.js, Astro, Remix', 'Next.js 16 with Supabase', 'Phase 1 complete', 'completed', '2024-01-01', '2024-03-01', 'admin-user-id');

-- Sample competitions
-- insert into public.competitions (title, description, organizer, category, registration_deadline, competition_date, status, brief, created_by)
-- values
--   ('Gemastik 2024', 'National student competition', 'Kemendikbud', 'Programming', '2024-03-01', '2024-05-01', 'tracking', 'Track registration and prepare team', 'admin-user-id');

-- Sample knowledge articles
-- insert into public.knowledge_articles (title, slug, content, excerpt, tags, status, author_id, published_at)
-- values
--   ('Getting Started with NCD', 'getting-started', '# Welcome\n\nThis is a guide...', 'Quick start guide for new members', ARRAY['guide', 'onboarding'], 'published', 'admin-user-id', now());