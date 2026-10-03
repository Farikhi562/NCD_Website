# NCD Website — Decision Log

## D-03: Authentication Strategy

**Question:** How should authentication be implemented for NCD members?

**Decision:** Supabase Auth with email/password authentication. Password reset via email link. No social providers. No public sign-up.

**Why:** 
- NCD is a community organization (Digital Home), not an open SaaS. Controlled access is appropriate.
- Email/password is simple, well-understood, and doesn't require external OAuth apps.
- Magic-link password reset avoids storing reset tokens ourselves.
- No social providers reduces complexity and privacy surface area.

**Implementation Impact:**
- Add `@supabase/supabase-js` and `@supabase/ssr` dependencies
- Create Supabase client utilities (browser, server, middleware)
- Implement middleware for session refresh and auth guard
- Build `/login` page with email/password form and "Forgot password" flow
- Protect `/app/*` routes via middleware

---

## D-04: Role System and Authorization

**Question:** What roles exist, how are they assigned, and how is authorization enforced?

**Decision:** Three roles stored in `profiles` table: `member`, `admin`, `treasurer`. Role assignment is admin-only via Supabase dashboard or server-side script. All authorization enforced via Supabase RLS policies — never client-side only.

**Why:**
- MVP needs: members (authenticated access), admins (manage people/content), treasurers (Kas operations).
- RLS at database level is the only trustworthy enforcement; client-side checks are UX only.
- Role column on `profiles` keeps schema simple; no separate roles table needed for MVP.
- Admin-only role assignment prevents privilege escalation.

**Implementation Impact:**
- `profiles` table with `role` column (default: `member`)
- RLS policies on all protected tables referencing `auth.uid()` and `profiles.role`
- Server-side helpers to check roles via Supabase Admin API (service role key, server-only)
- Client-side role reading only for UI conditional rendering (never for auth decisions)

---

## D-05: Sign-up / Account Creation Flow

**Question:** How do new members get accounts?

**Decision:** Invite-only. Admins create accounts via Supabase Dashboard (Authentication → Users → Invite User) or a future admin UI. No public registration page. No email verification requirement beyond Supabase's default.

**Why:**
- NCD is a closed community; unrestricted sign-up contradicts "Digital Home" principle.
- Supabase Dashboard invite flow is zero-code for MVP.
- Avoids building admin UI for user management in Phase 2.
- Email verification is handled by Supabase; we don't need custom logic.

**Implementation Impact:**
- No `/register` or `/signup` route.
- `/login` page only shows email/password + "Forgot password".
- Admins use Supabase Dashboard to invite members.
- Future: build admin user management in `/app/people` when needed.