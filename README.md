# NCD Website — Phase 1 foundation

Digital Home of NCD. Source of truth: `spec.md`, `design.md`, `agents.md` (not included in this ZIP; keep them in the repo root).

## Run

```bash
npm install
cp .env.example .env.local   # optional in Phase 1
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm run build
```

Stack: Next.js 16 (App Router), TypeScript strict, Tailwind v4, Lucide, Geist Sans/Mono via `geist`.

## What Phase 1 contains

- Design tokens from `design.md` §3–§11 in `src/app/globals.css` (surfaces, text, borders, accent, semantic, radius 4–16, type scale with mobile step-down, focus ring, reduced motion).
- Shell: skip link, sticky header, mobile drawer (native `<dialog>`), footer. Nav hierarchy in `src/config/navigation.ts`, copy in `src/config/content.ts`.
- Primitives (`src/components/ui`): Button, ButtonLink, IconButton, Field, Input, SearchInput, Select, Badge, Avatar, AvatarGroup, Card, Table, Sheet, Breadcrumb, Timeline, Progress, Skeleton, EmptyState, ErrorState, Container, PageHeader, ModulePage.
- Public routes: `/`, `/about`, `/people`, `/projects`, `/competitions`, `/knowledge`, `/activities`, `/transparency`, `/archive`, plus `/login` placeholder. Module pages are honest empty states with a "Coming soon" badge.
- Homepage: typographic hero, Current Pulse (live-query shape, all values "Not yet documented"), module index, Ecosystem diagram (ordered list, vertical below `lg`, horizontal with return path at `lg+`).
- Loading, error, not-found states. `sitemap.xml`, `robots.txt` (disallows `/app`, `/admin`, `/login`), page metadata and canonical URLs.

## Not in Phase 1 (on purpose)

- Supabase, auth, RLS, schema, migrations, Kas (protected areas in `agents.md` §10).
- `/app` and `/admin` routes (no auth guard exists yet, so they are not exposed).
- Tabs, Dialog, Popover, Tooltip, Toast, Pagination primitives; domain cards (no data yet).
- Per-page generated OG images; command palette (V1, F-22).
- shadcn/ui CLI was not run. Primitives are hand-written to the tokens. Add Radix-based shadcn components when Dialog/Popover/Tooltip/Toast are needed.

## Assumptions (record in `spec.md` §21 if they matter)

- UI chrome is English (D-07 undecided). Strings are centralised for later translation.
- Text wordmark "NCD" only; no NEXA logo or teal (D-01, D-02).
- `/people` is left out of the sitemap until the consent decision (D-06); the page itself is a placeholder.
- Homepage groups People / Projects / Competitions / Activities / Knowledge into one index instead of five empty sections.
- Canonical host is `NEXT_PUBLIC_SITE_URL` (D-23).

## Validation (actual results)

- `npm run lint`: pass. `npm run typecheck`: pass. `npm run build`: pass (14 static routes).
- Rendered with headless Chromium at 390, 768, 1280: no horizontal overflow; mobile menu opens.
- Not run: keyboard-only walkthrough, screen reader check, axe, contrast tool (design.md marks several ratios `VERIFY`), tests (none exist yet).
