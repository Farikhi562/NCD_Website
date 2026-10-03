# AGENTS.md — Working Rules for AI Coding Agents (NCD Website)

> **HOW AI should build it.**
> `spec.md` = what and why · `design.md` = how it looks and feels · `agents.md` = how to work.
> If you are an AI coding agent: read this file first, then `spec.md` and `design.md`, before touching anything.

**Status:** Draft v0.1
**Goal of this repo:** the official website of NCD (NEXA Community Development) — *the digital infrastructure that documents, connects and grows the NCD ecosystem.* It is not a company-profile site. A developer opening this repository six months from now should understand the product, the design system, the engineering rules, and the reasons behind decisions without asking the original author.

---

## 0. Precedence and Truth

When sources disagree, resolve in this order:

1. **A direct instruction from the human maintainer in the current task** (but see §10 for protected areas).
2. `spec.md` — product behavior and data requirements.
3. `design.md` — visual system.
4. This file — engineering process.
5. Existing code (it can be wrong; it is evidence of behavior, not of requirements).
6. Your own assumptions — **last, and only when written down as an assumption** (§9).

**Source of truth for organization facts:** the NCD planning document (*Rancangan NCD satu semester, Oktober 2026 – April 2027*), as summarized in `spec.md`. That document calls itself an early draft for discussion, not decisions. Treat its content as **provisional requirements**, and treat anything marked `UNDEFINED` or `DECISION NEEDED` as **not yet decided**.

If you need a fact about NCD that is not in `spec.md` or the source document: **do not make it up.** Use a clearly labeled placeholder state (§8) and record the question (§9).

---

## 1. The Workflow: Read → Understand → Plan → Implement → Validate → Report

Every task follows these six stages. Skipping one is a defect in the work, even if the code runs.

### 1.1 Read
Before changing any code:

1. **Inspect the repository** — structure, `package.json`, config files, lockfile, scripts.
2. **Inspect the relevant files** — the files you expect to change and their neighbors.
3. **Inspect existing components** — search `components/ui` and domain folders before creating anything.
4. **Inspect the schema** — current Supabase schema/migrations, RLS policies, generated types.
5. **Understand current behavior** — run it, read the tests, reproduce the bug or view the page.
6. Read the relevant sections of `spec.md` and `design.md`.

Use search (grep/ripgrep, file tree) rather than guessing. If something you expected is not there, say so.

### 1.2 Understand
Write down (in your plan, not in code comments):
- What the task asks, in one or two sentences.
- Which `spec.md` requirement(s) it implements (cite section / feature ID, e.g. `F-07`).
- Which `design.md` rules apply.
- What could break (neighboring features, permissions, data).
- What is **undefined** — and whether it blocks you.

### 1.3 Plan
- List the smallest set of changes that fully solves the task.
- Name files you will create/modify and why. Reuse before creating.
- State your validation steps (§1.5).
- For anything touching **schema, RLS, auth, permissions, Kas, the design tokens, or dependencies**, the plan must say so explicitly and wait for confirmation unless the task already authorizes it (§10).
- If the task is larger than ~one focused change, split it and propose the split.

### 1.4 Implement
- **Implement the smallest correct change.** No drive-by refactors, no unrelated cleanups, no formatting churn on files you didn't need to touch.
- Follow existing conventions in the repo. Adapt to the existing structure; do not reorganize it without a reason recorded in the plan.
- Use the design tokens and primitives (§5). Use the data-access and permission helpers (§6).
- Write or update tests when behavior changes (§1.5).
- Keep commits/changes reviewable: one concern per change.

### 1.5 Validate
Run what exists and report real results — never claim a check passed that you did not run.

Minimum, when the scripts exist in the repo:
- Type check (`tsc --noEmit` or the project's script)
- Lint
- Unit/integration tests relevant to the change
- Production build (`next build`) when you changed routing, config, metadata, or server/client boundaries
- For UI changes: visually check at **390px, 768px and 1280px**, with keyboard navigation and visible focus; confirm empty/loading/error states exist
- For permission/RLS changes: test as **each affected role** (PUBLIC, MEMBER, PIC, DIVISION_LEAD, LEADERSHIP, ADMIN), including **denial** cases
- For Kas changes: test balance computation, append-only behavior, unauthorized write attempts

If a check cannot be run (no script, no environment, no network), say so explicitly. "Not run" is acceptable; "probably fine" is not.

### 1.6 Report
End every task with a short, honest report:

```
## Summary
What changed and why (1–3 sentences).

## Spec / Design references
spec.md §…, F-…; design.md §…

## Files changed
- path — what/why

## Validation
- ✓ typecheck  ✓ lint  ✓ tests (n)  ✓ build  ✓ viewed at 390/768/1280
- ✗/— not run: <what and why>

## Assumptions & open questions
- Assumption: …  (also added to spec.md Open Decisions if it matters)
- DECISION NEEDED: …

## Risks / follow-ups
```
Do not pad the report. Do not hide failures. Do not describe plans as completed work.

---

## 2. Prohibited Actions

An AI agent working in this repo **must not**:

- **Rewrite the entire application** (or a large area) without a recorded reason and approval.
- **Install unnecessary dependencies.** Before adding any package: confirm the need, check for an existing solution in the stack/repo, record the reason, and get approval (§10). No library for a single trivial effect.
- **Create duplicate components.** Search first. Extend or compose existing ones.
- **Create duplicate utilities.** Search `lib/utils`, `hooks`, and neighbors first.
- **Invent product requirements.** If `spec.md` doesn't say it, propose it (§9) — don't ship it.
- **Invent organizational data.** No made-up members, roles, divisions, activities, competitions, projects, achievements, partners, quotes, or testimonials.
- **Create fake financial data.** No invented balances, transactions, iuran amounts or targets — not in seed data, tests-in-production, screenshots or docs. (See §8.)
- **Create fake achievements.** No awards, rankings, wins, certificates.
- **Silently change the design system.** Token/typography/radius/spacing/motion changes require editing `design.md` and calling it out.
- **Silently change the database schema.** Schema/RLS changes require an explicit migration, an updated `spec.md` data section, and confirmation (§10).
- **Remove working features** unless the task says to, and then say so in the report.
- **Introduce unnecessary abstraction.** No generic frameworks, factories, or config layers for one use. Prefer clear, boring code.
- **Expose secrets** or put privileged keys in client code (§7).
- **Weaken security or accessibility to make something work.**
- **Present guesses as facts** in code, copy, or reports.

---

## 3. Stack (Standard)

| Layer | Choice |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript (strict) |
| UI | React, Tailwind CSS, shadcn/ui, Lucide React |
| Fonts | Geist Sans, Geist Mono (via `next/font`) |
| Backend | Supabase: PostgreSQL, Auth, Storage, Row Level Security |
| Clients | `@supabase/supabase-js`, `@supabase/ssr` |

Rules:
- **Verify, don't assume.** Next.js 16+ and its conventions evolve (routing, caching, request APIs, middleware/proxy conventions). Before relying on a framework API from memory, check the installed version in `package.json` and the project's own docs/code. If you are unsure whether an API exists in the installed version, check, rather than guess.
- **Server Components by default.** Use `"use client"` only for interaction, state, browser APIs, animation, forms, and client-side data behavior. Keep client boundaries as low in the tree as possible. Never make the whole app a Client Component.
- **Data fetching** happens on the server where possible; secrets and privileged logic stay server-side.
- **Images** via Next.js image optimization; lazy-load below the fold.
- **No new framework-level libraries** (state managers, animation libraries, form frameworks, CSS-in-JS) without approval.

---

## 4. Repository Structure

Use a modular structure. **Adapt to the repository if a structure already exists — do not restructure without reason.**

```
src/
├── app/
│   ├── (public)/        # public site: /, about, people, activities, projects, competitions, knowledge, transparency, archive
│   ├── (auth)/          # login, password reset, magic link (if approved)
│   ├── app/             # authenticated: dashboard, people, activities, projects, competitions, squads, knowledge, growth, documentation, kas
│   └── admin/           # admin: overview, members, activities, projects, competitions, knowledge, documentation, kas, media, settings
│
├── components/
│   ├── ui/              # primitives (Button, Input, Card, Table, Dialog, …)
│   ├── navigation/
│   ├── people/
│   ├── projects/
│   ├── competitions/
│   ├── activities/
│   ├── knowledge/
│   └── kas/
│
├── lib/
│   ├── supabase/        # server/browser clients, typed queries
│   ├── auth/            # session helpers
│   ├── permissions/     # role resolution & guards (server-side)
│   └── utils/
│
├── types/
├── hooks/
└── config/              # navigation, constants, UI copy that needs central control
```

Conventions:
- One component per file; name files after the component (`MemberCard.tsx`).
- **Domain components compose primitives** from `components/ui`. They don't re-implement buttons, cards, or tables.
- Pages stay thin: fetch → authorize → render components.
- Colocate tests with the code or in the project's existing test location.
- Route groups follow `spec.md` §7. A page existing in the route tree does **not** mean it is in the MVP (`spec.md` §14).
- Navigation items live in `config/` so hierarchy is controlled in one place (and not all pages are shown at once).

---

## 5. Design System Compliance

`design.md` is the single source of truth. Agents must:

- Use **tokens**, never raw hex values or arbitrary pixel values, unless the token doesn't exist — in which case propose a token (edit `design.md`) rather than hard-coding.
- Use **only** the allowed spacing scale, radii, type scale, and motion durations.
- Respect accent rationing (7 permitted uses) and semantic-color rules (semantic meaning only; never color alone).
- Build with existing primitives; for a new primitive, check shadcn/ui first and restyle it to the tokens.
- Provide **loading (skeleton), empty, error, and permission-denied** states for every data-driven view.
- Mobile layout is designed deliberately at 375/390/430 and tablet 768; wide tables use the strategy in `design.md` §18.
- Respect `prefers-reduced-motion`.
- Known contrast restrictions (`design.md` §3): don't use `--text-muted` for important information; don't put small white text on `#8B5CF6`; use Lavender for accent text/links on dark. These are **hard rules**, not suggestions.
- Copy follows `design.md` §29: concise, direct, human, specific. No corporate filler.

Never: stock photos of people, glassmorphism, gradient washes, neon glow, rank/leaderboard UI, pill-everything, shadows on every card, full-page purple.

---

## 6. Data, Authorization, and Permissions

### 6.1 Data
- Schema must be **relational and structured**, with the entity list in `spec.md` §10.
- **Do not finalize schema details that the requirements haven't defined.** For unspecified fields write `TODO` / `DECISION NEEDED` in the spec and keep the architecture extensible (e.g. configurable retrospective questions rather than six hard-coded columns, because the questions are `UNDEFINED`).
- Period-scoped data carries a `period_id`. **Never hard-delete historical content.** Use archive/soft-delete.
- Use generated database types; do not hand-write types that can drift.
- Migrations: small, reversible where possible, named by intent, reviewed. No migration without confirmation (§10).

### 6.2 Roles
`PUBLIC · MEMBER · PIC · DIVISION_LEAD · LEADERSHIP · ADMIN` — see `spec.md` §6 for how these map to the NCD document (Ketua/Wakil = LEADERSHIP; division heads = DIVISION_LEAD; PIC is assigned per scope; ADMIN holder is undecided).

- **Never trust a role sent from the client** (headers, cookies set by the client, form fields, query params, local storage).
- Resolve roles **server-side from the database** for the authenticated user.
- Enforce authorization **twice**: in the database (RLS) and in server code. Neither alone is sufficient.
- **Deny by default.** New table → RLS enabled with no permissive policy until intentionally added.
- A person may hold multiple roles/assignments; check scope (division, project, competition, squad), not only role names.

### 6.3 Row Level Security
- RLS on every table with non-public data. Policies are minimal and reviewed.
- Every policy has a test or a documented manual check for the **allowed** and the **denied** case.
- Do not use the service-role key to "get around" a failing policy. A failing policy means fix the policy or the caller's identity — not bypass.

### 6.4 NCD Kas — highest scrutiny
- Strictest access control in the system; dedicated policies; read and write separated.
- Fields are exactly those in the NCD document: date, description, income, expense, balance. Don't add fields without a decision.
- **Balance is computed**, never user-typed.
- Proposed integrity rules (pending decision `spec.md` D-18): append-only ledger; corrections via adjusting entries; audit log for writes.
- **No fake numbers** — ever. Empty ledger shows an empty state; unknown balance shows `Not available`.
- **No iuran amount or balance target** appears anywhere until leadership defines it.
- Money is stored as integer minor units or `numeric` — never floating-point.
- All Kas writes happen server-side with validation.

---

## 7. Security

- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` (or any secret) to the client: not in client components, not in `NEXT_PUBLIC_*` variables, not in logs, not in error messages, not in committed files.
- Only `NEXT_PUBLIC_*` values that are meant to be public may be exposed (e.g. the Supabase URL and anon/publishable key — and the anon key is only safe because RLS protects data).
- Use environment variables; commit `.env.example` with placeholder names only, never real values.
- Sensitive operations (role changes, Kas writes, publishing, deletions) are **server-side only**.
- **Validate all input** on the server (schema validation); don't rely on client validation.
- **Sanitize user-generated content** (Markdown/HTML) before storing or rendering. No `dangerouslySetInnerHTML` with unsanitized input.
- Storage buckets private by default; public only for assets explicitly marked public.
- Protected routes: auth checks on the server (not only in client redirects).
- `noindex` + robots disallow for `/app/*` and `/admin/*`.
- Treat member personal data (photos, majors, skills, Growth Map targets) as **personal data**: minimize collection, don't expose by default, don't log it. Public display requires the consent decision (`spec.md` D-06).
- If you see a vulnerability or a leaked secret, stop and report it — don't continue silently.

---

## 8. Data Integrity — No Invented Data

The NCD document is explicit about what exists and what doesn't. Follow it.

Allowed placeholder states: `Not available` · `Not yet documented` · `Coming soon` · a proper empty state.

Forbidden:
- Fake members, divisions, roles, or leadership names.
- Fake counts ("127 members", "24 projects", "18 competitions").
- Fake money ("Rp 12.500.000").
- Fake achievements, awards, partners, testimonials.
- "Lorem ipsum" in anything that could ship.
- Demo/seed data that looks real in production.

If you need data to build or test UI:
- Use **clearly labeled** fixtures (e.g. names like `Test Member 01`, amounts flagged `TEST`), in **test/dev only**, never seeded into production.
- Fixtures must be obviously fake and excluded from production builds/seeds.
- Anything shown on the "Current Pulse" must come from a live query; if the query returns zero, show the honest empty/zero state.

What **is** documented (and may be used as content once leadership confirms): vision, mission (marked as proposal), five values, leadership names and roles, three divisions, programs, support systems, roadmap months. Everything is still a draft. Check `spec.md` before quoting it.

**No ranking.** No leaderboards, "Top", "Most active", "#1", or cross-member comparisons — in UI, queries, analytics, or naming.

---

## 9. Handling Uncertainty (UNDEFINED / DECISION NEEDED)

When information is missing:

1. **Check** `spec.md` and the source document.
2. If still unknown and it **doesn't block** the task: choose the most conservative, reversible option; write it as an **Assumption** in your report; add a row to `spec.md` §21 Open Decisions if it affects behavior, data, permissions or UX.
3. If it **blocks** the task (schema, permission model, Kas rules, privacy): **stop and ask** with the options and your recommendation.
4. In code, mark with `// DECISION NEEDED(D-xx): …` or `// TODO(D-xx): …` and reference the decision ID. Don't leave unmarked guesses.
5. Never encode an undecided value as if it were final (statuses, categories, skill lists, roles, iuran, targets).

Currently open and relevant to every agent: see `spec.md` §21. Highlights that frequently bite: Kas visibility and write authority (D-03), who is ADMIN (D-04), membership/sign-up (D-05), public people page and consent (D-06), UI language (D-07), the six retrospective questions (D-08), competition/project/knowledge vocabularies (D-09 – D-11), NEXA brand relationship (D-01/D-02).

---

## 10. Protected Areas — Require Explicit Confirmation

Do **not** do the following on your own initiative. Propose in the plan and wait for a clear go-ahead (the task statement counts if it explicitly asks for it):

- Database schema changes, new migrations, RLS policy changes
- Auth flow changes, role/permission model changes
- Anything in NCD Kas
- Adding/removing/upgrading dependencies (including major upgrades)
- Design token changes, new global styles, new fonts
- Changing route structure or navigation hierarchy
- Deleting files, features, or data
- Changing build/CI/deployment configuration
- Introducing analytics or any third-party scripts (privacy)
- Publishing leadership/member photos or personal data

**This repository's current phase:** documentation only. If you are asked to start implementation, confirm the phase (MVP scope in `spec.md` §14), and still follow the workflow. Do not deploy.

---

## 11. Quality Checklist (Definition of Done)

A change is done when it satisfies all that apply:

**Product**
- [ ] Traces to a requirement in `spec.md` (ID cited).
- [ ] No invented requirements or organizational facts.
- [ ] Scope matches MVP/V1 stage; nothing "just in case".

**UX / UI**
- [ ] User knows what to do next; one primary action per view.
- [ ] Uses tokens and primitives; consistent with `design.md`.
- [ ] Loading, empty, error, permission-denied states present.
- [ ] Mobile (390), tablet (768), desktop (1280) verified.

**Engineering**
- [ ] Smallest correct change; no unrelated edits.
- [ ] Server Components by default; client boundary minimal.
- [ ] No duplicate components/utilities; no needless abstraction or dependencies.
- [ ] Typecheck, lint, tests, build as applicable — actual results reported.

**Data**
- [ ] No fake numbers, members, achievements or finances.
- [ ] Production metrics come from the database.

**Security**
- [ ] No secrets on the client; service-role key server-only.
- [ ] RLS in place and tested for allow **and** deny.
- [ ] Input validated; UGC sanitized; roles resolved server-side.
- [ ] Private data protected; internal pages `noindex`.

**Accessibility**
- [ ] Keyboard operable with visible focus; semantic HTML.
- [ ] Contrast per `design.md` §3 rules; status not by color alone.
- [ ] Labels, alt text, ARIA where needed; reduced motion honored.

**Performance / SEO**
- [ ] No unnecessary client JS or dependencies; images optimized.
- [ ] Public pages have metadata, OG, canonical; sitemap/robots updated if routes changed.

**Documentation**
- [ ] `spec.md` / `design.md` updated if behavior or visuals changed.
- [ ] New open questions added to `spec.md` §21.
- [ ] Report written per §1.6.

---

## 12. Communication Style (for reports and PRs)

- Plain, specific, short. Lead with the result.
- Say what you did **and what you did not do**.
- Distinguish **facts** (verified), **assumptions**, and **questions**.
- No hype, no filler, no apology theatre.
- Quote file paths and spec IDs so a reviewer can follow without searching.

---

## 13. Change Log for These Docs

Edit when the rules change; list the change and the reason.

| Date | Change | Reason |
|---|---|---|
| 2026-10-04 | Initial draft of `spec.md`, `design.md`, `agents.md` | Foundation before code |
