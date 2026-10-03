# NCD Website — Design System

> Single source of truth for **how NCD looks and feels**.
> Companion docs: `spec.md` (what and why), `agents.md` (how AI agents build it).

**Status:** Draft v0.1
**Rule of precedence:** if this file and an implementation disagree, this file wins until it is deliberately changed. Changing a token or a rule here is a design-system change and must be called out (see `agents.md`).

**Legend:** `DECISION NEEDED` = an owner must choose before it is built. `VERIFY` = a value computed by hand here that must be confirmed with a contrast tool before shipping.

---

## 1. Design Philosophy

**Primary reference: Linear — for discipline, not for looks.** We borrow principles only:

- information hierarchy
- typography discipline
- layout precision and spacing consistency
- restrained visual language, subtle borders, minimal shadows
- dense but readable interfaces
- excellent empty states
- clear, keyboard-friendly navigation
- purposeful animation
- product-oriented UX

We do **not** copy Linear's layouts, colors, copy, or components. NCD forms its own language.

**NCD should feel:** *calm, precise, human, ambitious.*

**NCD must not feel like:** a corporate template, a university-organization template, generic SaaS, a futuristic AI dashboard, a glassmorphism showcase, or a Dribbble concept nobody can use.

**What the website is:** the digital home where NCD's people, learning, projects, competitions and records live. [`spec.md` §1] The interface should read like a well-made internal product that happens to have a public face — not like a brochure.

**Guiding sentences**

1. Structure carries information. A border, a number, a label exists because it tells the reader something.
2. Calm by default; emphasis is rationed.
3. Motion explains, it does not decorate.
4. Real data or an honest empty state — never filler numbers.
5. Mobile is its own layout.
6. Accessibility is not traded for style.

**Where the one memorable thing lives:** the **Ecosystem** visualization (People → Learn → Connect → Build → Compete → Document → Grow) and the **typographic hero**. Everything else stays quiet so those two can carry the identity.

## 2. Brand Personality

| Trait | In practice |
|---|---|
| **Calm** | dark neutral surfaces, generous space, few simultaneous colors |
| **Precise** | strict grid, consistent radii/spacing, aligned numerals |
| **Human** | plain-spoken copy, real names and real work, no stock smiles |
| **Ambitious** | confident typography, serious product craft |

**Voice:** concise, direct, human, confident, specific. Sounds like a person who runs the community, not a generator of LinkedIn posts. See §28.

**Values the design must be consistent with** (from the NCD document, still a draft): Growth, Collaboration, Ownership, Learning, Contribution. Practical consequences:
- **Growth** → progress is shown against one's own start, never against other members (no ranking visuals, ever).
- **Collaboration** → team and squad views emphasize groups, roles and handoffs, not individual stars.
- **Ownership** → every item shows who is responsible (PIC) and when it was last updated.
- **Learning** → failure is a legitimate state (e.g. retrospectives and failed entries are shown without shame styling).
- **Contribution** → authorship is visible on knowledge and projects.

**Relationship to the NEXA brand — `DECISION NEEDED` (D-02).** The NCD document uses a teal/navy palette and the "NEXA Tech Labs" logo; this brief prescribes a dark neutral + violet identity for the NCD website. This system implements the brief's palette. Whether the NEXA logo/teal should appear (footer attribution? co-brand lockup?) must be decided by NCD leadership. Until then: **no NEXA logo or teal in the UI**, and no invented NCD logo. A text wordmark ("NCD") is used.

## 3. Color Tokens

Dark-first interface. All values below are the **starting tokens** from the brief. Implement as CSS variables / Tailwind theme tokens; components reference **token names, never raw hex**.

### 3.1 Surfaces (Base)

| Token | Hex | Use |
|---|---|---|
| `--ncd-black` | `#09090B` | page background |
| `--ncd-dark` | `#0F1012` | sidebar, secondary background |
| `--ncd-surface` | `#141518` | cards, panels |
| `--ncd-surface-elevated` | `#191B1F` | popovers, menus, inputs on surface |
| `--ncd-surface-hover` | `#1E2126` | hover/pressed fill |

Elevation is expressed by **surface step + border**, not by shadow. Ordering: black → dark → surface → elevated → hover.

### 3.2 Text

| Token | Hex | Use | Contrast on `#09090B` (VERIFY) |
|---|---|---|---|
| `--text-primary` | `#F4F4F5` | headings, key content | ≈ 18:1 |
| `--text-secondary` | `#A1A1AA` | body secondary, descriptions | ≈ 7.5:1 |
| `--text-muted` | `#71717A` | meta text, timestamps, placeholders | ≈ 4.1:1 ⚠ |
| `--text-disabled` | `#52525B` | disabled controls only | below AA (permitted for disabled) |

**Important contrast finding.** `--text-muted` on `#09090B` is roughly 4.1:1 and lower on lighter surfaces (≈3.8:1 on `#141518`), which is **below the 4.5:1 AA requirement for normal-size text**. Rules:
- Do **not** use `--text-muted` for information a user needs (dates, amounts, statuses, required hints). Use `--text-secondary`.
- `--text-muted` is allowed for non-essential supplementary text only at 18px+ or 14px bold (large-text threshold 3:1), and for decorative separators.
- The brief itself says *"Jangan menggunakan font size kecil untuk informasi penting"* — consistent with this rule.
- `DECISION NEEDED`: either lighten Muted slightly (e.g. toward `#8B8B94`) or accept the restriction above. Default: **accept the restriction**; keep the brief's hex.

### 3.3 Borders

| Token | Value | Use |
|---|---|---|
| `--border` | `#27272A` | default dividers, card borders |
| `--border-strong` | `#3F3F46` | inputs, emphasized separators, focused containers |
| `--border-subtle` | `rgba(255,255,255,0.06)` | hairlines inside dense areas (table rows) |

Non-text UI boundaries needed to identify a control (e.g. an input's edge) must reach **3:1** against adjacent color: use `--border-strong` for inputs (VERIFY: `#3F3F46` vs `#141518` is ≈ 1.7:1, which is **insufficient** by itself). Therefore inputs also get a visible fill difference **and** a label/placeholder, and focus uses the accent ring (§3.4). `DECISION NEEDED`: raise input border to a lighter value (≈ `#71717A`) if strict 3:1 control boundary is required. Default: use `--text-muted` as the input border color.

### 3.4 Accent

| Token | Hex | Role |
|---|---|---|
| `--ncd-electric` | `#7C3AED` | primary accent: primary button fill, active nav indicator, focus ring, progress fill |
| `--ncd-violet` | `#8B5CF6` | secondary accent: hover state of electric, selection tint, secondary chart series |
| `--ncd-lavender` | `#A78BFA` | highlight: **accent text and links on dark**, small emphasis |

**Accent use is rationed.** Allowed uses:
1. active navigation
2. primary CTA
3. focus state
4. important links
5. selected state
6. progress
7. one important visual anchor per view

Never: full-page purple, accent as card background everywhere, accent on every icon, gradient washes.

**Contrast rules for accent (VERIFY with a tool):**
- White (`--text-primary`) text on `--ncd-electric` ≈ 5.7:1 → **OK for button labels**.
- White on `--ncd-violet` ≈ 4.2:1 → **not enough for small text**. Use Violet for fills without text, borders, tints, or large text only.
- `--ncd-electric` as **text** on `#09090B` ≈ 3.5:1 → **fails for normal text**. Don't use electric for small text/links.
- `--ncd-lavender` as text on `#09090B` ≈ 7:1 → **use this for links and accent text on dark**.
- Focus ring: 2px `--ncd-lavender` with 2px offset (≥3:1 vs adjacent colors). Electric alone is too dim as a ring on the darkest surface.

### 3.5 Tint helpers (derived)

Allowed derived tokens (no new hues):
- `--accent-tint`: electric at ~12% opacity over the surface, for selected rows/nav backgrounds.
- `--accent-border`: electric at ~40% opacity, for selected card outlines.

### 3.6 Light theme

The brief specifies **dark-first** and defines **no** light palette. Light theme is **out of scope** until decided. `DECISION NEEDED`. Implementation must still use tokens so a future light theme is possible, and must respect `color-scheme: dark`.

### 3.7 Color usage ratio (guideline, not a constraint)

~75% neutral surfaces · ~15% typography/borders · ~8% accent · ~2% semantic colors. A screen that looks neon has failed this guideline.

## 4. Semantic Colors

| Token | Hex | Meaning |
|---|---|---|
| `--success` | `#22C55E` | Completed · Active · Verified |
| `--warning` | `#F59E0B` | Upcoming · Needs attention |
| `--danger` | `#EF4444` | Failed · Rejected · Critical |
| `--info` | `#3B82F6` | Information · Draft |

Rules:
- Used **only** for semantic meaning, never decoration.
- **Never rely on color alone.** Every status carries a text label (and optionally an icon). Required for accessibility and color-blind users.
- Badge style: tinted background (~12% of the semantic color), text in the semantic color or `--text-primary`, 1px border at ~30% opacity. Verify text contrast on the tinted surface.
- Ledger: income/expense use **restrained** treatment — color only the number, signs `+`/`−` always present. Do not color entire rows.
- `Failed`/`Rejected` for squads or competitions must feel factual, not shaming (Learning value: *"Kesalahan dan kegagalan dianggap bahan evaluasi"*, NCD document).

**Mapping of NCD statuses to semantics** (status vocabularies themselves are `DECISION NEEDED` in `spec.md`; the *semantic mapping* below is the design rule):

| Meaning | Color | Example labels (proposals) |
|---|---|---|
| Done / healthy | success | Completed, Active, Verified, Submitted |
| Time-sensitive | warning | Upcoming, Deadline soon, Needs attention |
| Problem / ended badly | danger | Failed, Rejected, Critical |
| Neutral info / not final | info | Draft, Info |
| No state / archived | neutral (muted fill) | Archived, Not started |

## 5. Typography

- **Interface:** Geist Sans, everywhere.
- **Technical/numeric:** Geist Mono (see §6).
- Load via `next/font` (self-hosted, no layout shift). Fallback stack: `system-ui, -apple-system, "Segoe UI", sans-serif` for Sans; `ui-monospace, SFMono-Regular, Menlo, monospace` for Mono.
- Sentence case for UI text. Avoid ALL CAPS except in the explicit mono date format (§6) and very short labels where it encodes a code.
- Line length: body text ≤ 80 characters; reading column **720–820px** (brief).
- Numerals in tables and ledgers use **tabular numbers** (`font-variant-numeric: tabular-nums`).
- Indonesian and English content both appear; line-height must allow Indonesian's slightly longer words and compounds to wrap cleanly (no truncating essential words).

## 6. Monospace

Use **Geist Mono** for:

- statistics and counts
- IDs
- timestamps and dates
- technical information and code
- **financial numbers**
- status metadata
- competition deadlines (where context fits)

Date style (brief): two-line stamp such as

```
OCT 04
2026
```

Never use mono for paragraph text, headings, or nav.

Money format: `Rp` + Indonesian grouping (`Rp 1.250.000`), mono, tabular. The **currency formatting locale** is `id-ID`. Amounts come from the database only. If a figure is unavailable: `Not available`, never `Rp 0` (unless the true value is zero).

## 7. Type Scale

From the brief; sizes in px / line-height px. Mobile column proposes step-downs (the brief doesn't specify mobile sizes → `DECISION NEEDED` to confirm).

| Style | Desktop (size/lh) | Weight | Mobile (proposal) | Use |
|---|---|---|---|---|
| Display | 64 / 72 | 600 | 40 / 48 | homepage hero only |
| H1 | 48 / 56 | 600 | 32 / 40 | page titles |
| H2 | 36 / 44 | 600 | 26 / 34 | major sections |
| H3 | 24 / 32 | 600 | 20 / 28 | subsections, card titles (large) |
| H4 | 18 / 26 | 600 | 18 / 26 | card titles, panel headings |
| Body Large | 18 / 28 | 400 | 17 / 26 | intros, lead paragraphs |
| Body | 15 / 24 | 400 | 15 / 24 | default text |
| Body Small | 14 / 20 | 400 | 14 / 20 | secondary text, table cells |
| Caption | 12 / 18 | 400 | 12 / 18 | non-essential meta only |
| Label | 12 / 16 | 500 | 12 / 16 | field labels, badges |

Rules:
- **No information that matters in Caption or Label size.** Deadlines, balances, statuses, and required fields use Body Small or larger (tabular mono is fine at 14).
- Weight: only 400, 500, 600. No 700+, no italics for emphasis in UI chrome.
- Letter-spacing: slightly negative on Display/H1 (≈ −0.02em), default elsewhere.
- Headings use a single weight (600); hierarchy comes from size and spacing.
- Heading levels follow document structure (semantic h1→h6), styled independently of level when needed.

## 8. Spacing

4px base grid. Allowed values (px): **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128**.

Guidelines:
- Inside controls: 8–12 (buttons 8/12 vertical-horizontal minimum; height tokens below).
- Inside cards: 16–24.
- Between related items: 8–16; between groups: 24–32; between sections: 64–96; hero: up to 128.
- Prefer these tokens to arbitrary values. If an arbitrary value is truly needed, record why.
- Tap targets ≥ 44×44px on touch (WCAG 2.2 target size minimum is 24px; 44 is our standard for mobile).

Control heights: small 32, default 40, large 48.

## 9. Radius

Allowed: **4, 6, 8, 10, 12, 16** px.

| Element | Radius |
|---|---|
| Buttons | 8 |
| Inputs / selects | 8 |
| Cards | 10 |
| Modals/dialogs | 12 |
| Large surfaces / hero panels | 12–16 |
| Small chips, code | 4–6 |
| Badges | **pill only when it is a semantic status**; otherwise 6 |
| Avatars | circle (members); square-ish 8 for project/org avatars |

Banned as defaults: `rounded-[32px]`, `rounded-[40px]`, and "everything is a pill". Radius **steps with hierarchy** — nested elements have a smaller radius than their container.

## 10. Borders

- Default: 1px `--border`.
- Dense internal separators (table rows, list items): 1px `--border-subtle`.
- Emphasized/interactive containers: `--border-strong`.
- Selected: `--accent-border` + `--accent-tint`.
- Focus: see §23 — never replaced by border color change alone.
- Avoid double borders (card inside bordered panel inside bordered section). Nest with surface steps instead.
- No decorative gradient borders.

## 11. Shadows

Shadows are **rare and subtle**. Prefer **border + surface contrast**.

Allowed only for: modal/dialog, popover, dropdown/menu, tooltip, toast, floating elements.
Cards, tables, and sections: **no shadow**.

Reference (adjust for dark backgrounds): `0 8px 24px rgba(0,0,0,0.4)` plus a 1px `--border-strong` outline for overlays. Do not stack multiple shadows. No colored/glow shadows.

## 12. Grid

- Max content width: **1280px** (desktop container).
- Reading width: **720–820px** (articles, project case studies, retrospectives).
- 12-column grid on ≥ lg; 4 columns on mobile; 8 on tablet.
- Gutters: 16 (mobile), 24 (tablet), 24–32 (desktop).
- Page horizontal padding: 16 (mobile), 24 (tablet), 32–48 (desktop) — respecting safe areas on mobile.

## 13. Layout

**Public site:** top navigation + content container (max 1280).
**Authenticated app:** persistent **sidebar + main content**.
**Admin:** separate shell (own navigation), visually distinguished by a persistent "Admin" context label — not by a different palette.

Breakpoints (Tailwind): `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
Required test widths: **mobile 375 / 390 / 430; tablet 768; desktop 1024 / 1280 / 1440.**

Principles:
- **Mobile is its own layout**, not a shrunken desktop. Reconsider content order, density and navigation per breakpoint.
- Content-first: the page title and primary action appear within the first screen.
- Sidebar collapses to a sheet below `lg`.
- One primary action per view.
- Dense lists are fine **if** type and spacing stay legible (Linear-style density, 14px rows with ≥ 40px height, ≥ 44px on touch).

## 14. Navigation

**Public (desktop):** wordmark `NCD` at left; **People · Projects · Competitions · Knowledge · Activities** in the center/left cluster; **About** and **Login** at right. Nothing else.

**Authenticated:** **Overview · People · Projects · Competitions · Knowledge · Activities · Transparency**. Squads, Growth, Documentation and Kas are reached via Overview, contextual links, and command search (final placement is `DECISION NEEDED`, `spec.md` §7).

**Admin:** separate navigation set (Overview, Members, Activities, Projects, Competitions, Knowledge, Documentation, Kas, Media, Settings).

**Mobile:** compact top bar (wordmark + search + menu); menu opens a **sheet/drawer** with grouped items (max ~7 top-level items, never 30); **bottom navigation** only for the authenticated app if it fits, limited to 4–5 destinations.

**Active state:** accent indicator (2px bar or tint) + `aria-current="page"`. **Hover:** surface-hover. **Focus:** visible ring.

**Keyboard:** `Tab` order matches visual order; skip-to-content link first; **command palette (⌘/Ctrl + K)** for search/jump is a V1 target (`spec.md` F-22); `/` focuses search where a search exists; `Esc` closes overlays. Shortcuts never override browser/OS defaults and are discoverable via tooltip.

**Breadcrumbs:** on deep pages (Competition detail, Project detail, Knowledge article, Archive period).

## 15. Buttons

| Variant | Appearance | Use |
|---|---|---|
| Primary | `--ncd-electric` fill, `--text-primary` label | the one main action per view |
| Secondary | `--ncd-surface-elevated` fill, `--border-strong` outline | alternate actions |
| Ghost | transparent, hover `--ncd-surface-hover` | toolbars, low emphasis |
| Link | `--ncd-lavender` text, underline on hover/focus | in-text navigation |
| Destructive | `--danger` fill or outline | irreversible actions, always confirmed |

- Sizes 32 / 40 / 48, radius 8, label Body Small/Body at weight 500.
- States: default, hover, active (pressed: slight darken, no bounce), focus-visible (ring), disabled (`--text-disabled`, no hover), loading (inline progress indicator, label retained, width constant).
- Icon-only buttons (`IconButton`) require an **accessible name** (`aria-label`) and a tooltip.
- Button labels are verbs: "Create project", "Save changes", "Explore NCD". Same action keeps the same name throughout a flow (button "Publish" → toast "Published").
- Avoid appending `→` to every button; use it only on "View project →"-style navigational links per the brief's card pattern.

## 16. Inputs

- Height 40, radius 8, fill `--ncd-surface-elevated`, border per §3.3.
- Always a **visible label** (placeholder is not a label). Helper text below; error text replaces helper text with an icon + message.
- Focus: accent focus ring (§23).
- Error: `--danger` border + message text; never color only.
- `SearchInput`: leading search icon, clear button, `role="search"` on container, `Esc` to clear; results announced politely to assistive tech.
- `Select`/`Dropdown`: keyboard operable (arrows, type-ahead, Enter/Esc); prefer shadcn/Radix primitives.
- Forms: validate on submit and on blur; preserve user input on error; error summary at top for long forms; no destructive reset.
- Money input: numeric keypad on mobile, `id-ID` formatting, no negative values (type of entry is a separate field).
- Dates: native date inputs or accessible picker; display format per §6.
- Required fields marked with text ("Required"), not only an asterisk/color.

## 17. Cards

- Background `--ncd-surface`, border `--border`, radius 10, padding 16–24, **no shadow**.
- Hover (when clickable): background → `--ncd-surface-hover`, border → `--border-strong`; whole card is one focusable link (not nested links).
- Selected: `--accent-tint` + `--accent-border`.
- Internal structure: title (H4) → description (Body Small, secondary) → metadata (Body Small / mono) → footer action.
- **Do not make every section a grid of identical cards.** Use lists, tables and prose where they fit better.

### Domain card patterns (built from primitives)

**MemberCard** — product-profile feel:
```
[avatar]
Muhamad Fauzan        (name)
Informatics · 2025    (major · cohort)

AI  Data  Backend     (skill tags)

NCD
Project & Development (division)
```
(The brief's example is illustrative; real names come from the database.) **Never** include rank, "Top", "Most active", "#1", scores, or counts of contributions used to compare members.

**ProjectCard** — name, short description, tags (AI · Data · Web), status badge, team (AvatarGroup), period, "View project →".

**CompetitionCard / row** — Competition, Category, Deadline (mono), Eligibility, Status badge, PIC. Never poster-only. (Radar is primarily a table/list; cards are for mobile and the Home section.)

**ActivityCard / TimelineItem** — Date (mono), Activity, Category, Participants, Documentation link, Outcome.

**KnowledgeCard** — Title, Category, Author, Updated, Reading time.

**SquadCard** — Squad name, linked Competition/Project, status, members (AvatarGroup + roles), progress stepper (§ Progress).

**TransactionRow** — Date, Description, Income, Expense, Balance (mono, tabular); see §18.

## 18. Tables

- Header row: Body Small, weight 500, `--text-secondary`; sticky header on long tables.
- Rows: min height 40 (44 on touch); separators `--border-subtle`; hover `--ncd-surface-hover`.
- Numeric columns **right-aligned**, mono, tabular numerals. Text columns left-aligned.
- Sorting/filtering controls reachable by keyboard; sort state exposed via `aria-sort`.
- Semantic table markup (`<table>`, `<th scope>`), caption or accessible name.
- **Responsive strategy for wide tables** (brief: no 8 columns on 390px):
  1. horizontal scroll inside a bordered container with sticky first column, or
  2. column prioritization (hide secondary columns, reachable via row detail), or
  3. stacked card layout per row on mobile (preferred for Competition Radar and Activities).
  The choice per table is recorded in its component docs; the default for Radar is **stacked layout on mobile**, table on `md+`.
- Pagination for lists > ~25 rows (members are ~25–30, so most lists don't need it; the Kas ledger will grow).
- **Ledger table (NCD Kas)** — the most conservative surface in the product:
  - Columns: **Date · Description · Income · Expense · Balance** (exactly the NCD document's fields).
  - Header summary: **NCD KAS**; **Current Balance** `Rp …`; summary trio **Income / Expense / Balance**.
  - Plain styling: neutral surfaces only; semantic color applied **only to the signed number** (income: success, expense: danger), always with `+`/`−`; balance in primary text.
  - No charts, gradients, animations or celebratory UI.
  - Running balance is read-only and computed.
  - Show `Not available` for any figure not yet recorded; amounts like iuran/target are **not displayed** until defined (`spec.md` D-18).
  - Mobile: stacked rows (date + description on top, signed amount and balance beneath).

## 19. Badges

- Label 12/16, weight 500, radius 6; **pill (full radius) only for semantic status**.
- Types: **Status** (semantic color + text), **Category** (neutral: border + secondary text), **Tag/Skill** (neutral chip), **Count** (mono).
- Skills/tags are neutral — do not color-code skills (no rainbow).
- Never an icon-only badge without accessible text.
- Badges are not buttons; clickable filters use the Toggle/Chip pattern with `aria-pressed`.

## 20. Avatars

- Circle for people; sizes 24 / 32 / 40 / 64.
- **Fallback:** initials on a neutral surface (`--ncd-surface-elevated` with `--text-secondary`); **no random rainbow colors**.
- Photos: user-provided or approved only; optimized through Next.js image; `alt` = person's name (decorative when name is adjacent).
- `AvatarGroup`: overlap with 2px ring in the container surface color; max 4–5 visible + "+N"; "+N" has an accessible name listing the hidden count.
- Do not use stock human photos anywhere (hero or otherwise). Member photos appear only where the member has agreed. (`spec.md` D-06, D-24.)

## 21. Modals

- `Dialog`: radius 12, `--ncd-surface-elevated`, border `--border-strong`, subtle shadow, overlay `rgba(0,0,0,0.6)`.
- Width: 480 (confirm), 640 (form), max 90vw. Mobile: dialogs may become **full-width bottom sheets**.
- Focus: move into dialog on open, trap focus, return focus to the trigger on close, `Esc` closes, `aria-modal`, labelled title and description.
- Use sparingly. Prefer inline editing, popovers, or sheets for lightweight tasks.
- Destructive confirmations state **what** will happen and **what can't be undone**; confirm button names the action ("Delete entry"), not "OK".
- Kas actions that change money records always use an explicit confirmation step.

## 22. Drawers

- `Sheet`: side drawer on desktop (right, 420–560px) for detail/edit; bottom or left sheet on mobile for navigation and filters.
- Focus management identical to dialogs; swipe-to-close optional on mobile but never the only way.
- Mobile navigation drawer: grouped, short, with the current location marked.

## 23. Empty States

Informative and action-oriented; never cute. Structure: **title (what's missing)** → **one sentence (what will appear here)** → **action only if the viewer can act**.

Template (from the brief):

> **No projects yet.**
> Projects created by NCD will appear here.
> [Create project] ← only if the viewer has permission.

Rules:
- No sad faces, no jokes, no apology.
- No fake CTA when the viewer can't act.
- Each empty state is written per module (People, Projects, Competitions, Squads, Knowledge, Activities, Archive, Kas, Search no-results).
- Search with no results: state the query, suggest clearing filters, offer a link to browse categories.
- "Not available" / "Not yet documented" / "Coming soon" are first-class states for individual fields and sections (brief §41).
- Illustration: none or a restrained line icon (Lucide) in `--text-muted`; icon is decorative (`aria-hidden`).

## 24. Loading

- **Skeleton** screens that **match the real layout** (same heights, columns, radii). No generic spinner for whole pages.
- Skeleton fill `--ncd-surface-elevated`, shimmer subtle (opacity transform only, disabled under reduced motion).
- Inline/short operations: a small spinner inside the button or control, label retained.
- Optimistic UI only where failure is cheap; never for Kas.
- Avoid layout shift: reserve space for images and async content.
- Streaming/Suspense boundaries per section so the page shell appears immediately.

## 25. Errors

Error copy is **clear, short, non-blaming, with a recovery action when possible.**

Pattern (brief):

> **Something went wrong.**
> We couldn't load the projects.
> [Try again]

Rules:
- Say what failed in the user's terms, not stack traces.
- Field errors: inline, adjacent, with text + icon.
- Permission errors: explain what is restricted; how to get access if known (e.g. "Ask a Division Lead").
- 404: say the page isn't found and link to sensible places.
- 500/global: preserve the shell; offer "Try again" and "Go home".
- No alarmist red full-screen takeovers; use `--danger` sparingly.
- Announce form errors to assistive tech (`aria-live` / `role="alert"` where appropriate).

## 26. Motion

Principle: **motion should explain, not decorate.**

Use only: opacity, transform, subtle scale, layout transitions.

Durations:
| Type | Duration |
|---|---|
| Micro-interaction (hover, press, toggle) | 100–150ms |
| Standard transition (menu, tooltip, tab) | 150–250ms |
| Larger transition (dialog, sheet, page region) | 250–400ms |

Easing: ease-out for entering, ease-in for leaving, `cubic-bezier(0.2, 0, 0, 1)` as the default curve.

Forbidden: bouncing, excessive parallax, infinite floating, huge entrance animations, scroll-jacking, auto-playing carousels.

Allowed exceptions that explain state: progress fills, step transitions in a stepper, list reordering, skeleton shimmer.

**Reduced motion:** honor `prefers-reduced-motion: reduce` — remove transforms and shimmer, keep instant state changes. Motion is never the only carrier of information.

**Rationed attention motion:** at most **one** orchestrated moment on the homepage (e.g. a single reveal of the ecosystem cycle on first view). No entrance animation on every section; no hover-lift on every card.

Dependency rule: CSS transitions first. Do not add an animation library for one simple effect. (If one is ever needed, record the reason in the PR.)

## 27. Responsive Rules

- Treat **mobile as a first-class, separate layout** (375/390/430), then tablet (768), then desktop (1024/1280/1440).
- Navigation: compact top bar + drawer; optional bottom bar in the app.
- Cards: single column on mobile, two on tablet, three–four on desktop.
- Tables: per-table strategy (§18); never force 8 columns into 390px.
- Forms: single column on mobile; labels above inputs; full-width primary action.
- Modals → bottom sheets on mobile.
- Sidebar → sheet below `lg`.
- Typography: use mobile type scale (§7).
- Touch targets ≥ 44px; adequate spacing between adjacent targets.
- Test with zoom to 200% and text size increase; no loss of content or function (WCAG reflow 320 CSS px).
- Respect safe areas (notches, home indicators) with `env(safe-area-inset-*)`.

**Homepage per breakpoint (guidance):** Hero is typographic at all sizes; "Current Pulse" collapses to a vertical list; the Ecosystem diagram becomes a **vertical** sequence on mobile (People ↓ Learn ↓ … ↓ Grow, matching the brief's vertical diagram) and a horizontal/cyclic composition on desktop.

## 28. Accessibility

**Target: WCAG 2.2 AA.** Minimum requirements:

- **Keyboard:** everything operable by keyboard; logical focus order; no keyboard traps; skip link.
- **Visible focus:** 2px `--ncd-lavender` ring, 2px offset, on every interactive element (WCAG 2.4.7, 2.4.11/2.4.13 awareness: focus not obscured by sticky headers — use scroll-padding).
- **Semantic HTML:** landmarks (`header`, `nav`, `main`, `footer`, `aside`), real headings, lists, tables, buttons vs links used correctly.
- **Contrast:** text ≥ 4.5:1 (3:1 for large text); UI components and focus indicators ≥ 3:1. See §3 for tokens that need restrictions (Muted, Violet, Electric-as-text).
- **Not color alone:** statuses have text/icons.
- **Alt text:** meaningful `alt` for informative images; empty `alt` for decorative.
- **ARIA:** labels for icon buttons, `aria-current`, `aria-sort`, `aria-live` for async messages; don't use ARIA to fix wrong markup.
- **Forms:** programmatic labels, described errors, autocomplete attributes, no time-limited inputs.
- **Reduced motion:** supported (§26).
- **Target size:** ≥ 24×24 CSS px minimum (WCAG 2.2 2.5.8); our standard is 44px on touch.
- **Dragging alternatives:** any drag interaction (e.g. reordering) has a non-drag alternative (2.5.7).
- **Consistent help/navigation** across pages (3.2.6/3.2.3).
- **Accessible authentication:** password fields allow paste and password managers (3.3.8).
- **Language:** `lang` attribute set per page; mixed-language passages marked (`lang="id"` / `lang="en"`).
- **Testing:** keyboard-only walkthrough, screen reader spot checks (VoiceOver/NVDA), automated axe check in CI as a baseline (automated tools catch only part of issues).

Do not trade accessibility for visual effect. If a visual idea conflicts with an AA requirement, the visual idea changes.

## 29. Content Guidelines

**Tone:** concise, direct, human, confident, specific. Written like someone who actually runs the community.

**Rules**
- Sentence case. Active voice. Plain verbs.
- Name things by what users understand. Use NCD's own vocabulary where it exists: **Competition Radar, Competition Brief, Project Lab, Project Clinic, Competition Day, Retrospective, Growth Map, Knowledge Base, NCD Kas, Squad, PIC**. Don't rename them in the UI.
- One term per concept; keep it across the flow.
- Errors explain what happened and what to do; they don't apologize or blame.
- Empty states describe what will appear and who can add it.
- No corporate filler; no superlatives; no "empower", "unlock", "leverage", "synergy", "next generation".

**Replace this → with this** (from the brief)
- ✗ *Empowering the next generation of innovators.* → ✓ *People building things together.*
- ✗ *Unlock your limitless potential.* → ✓ *Learn something. Build something. Share what you learned.*

**Hero copy (from the brief):**

> **NCD**
> **Growth Together.**
> Meet people. Learn together. Build things. Compete. Document what happened. Grow from it.
> [Explore NCD] [View Projects]

**Statements anchored in the NCD document (usable as copy after leadership approval):**
- *NCD bukan cuma tempat mencari dan mengikuti lomba.* — the point of NCD (the site must not sound like a contest-announcement board).
- Growth is measured from your own start, not against others (Growth Map).
- Competition is one experience among several; the goal is not collecting trophies.

**Language:** UI language is `DECISION NEEDED` (English / Indonesian / bilingual). Until decided, UI strings live in one place (a content/config module) so they can be translated without redesign.

**Data integrity in copy:** never write invented counts, achievements, awards, partnerships or financial figures. Examples to avoid: "127 members", "24 projects", "18 competitions", "Rp 12.500.000". If a stat isn't from the database, don't show it.

**Writing about people:** names as members use them; no ranking language; no personal evaluation language. Leadership roles describe *role criteria*, not personal judgments (the NCD document is explicit: *"Ini kriteria jabatan, bukan penilaian pribadi"*).

## 30. Component Inventory

**Primitives (build once, reuse everywhere; prefer shadcn/ui primitives, restyle to these tokens):**
Button · IconButton · Input · SearchInput · Select · Dropdown · Badge · Avatar · AvatarGroup · Card · Table · Tabs · Dialog · Sheet · Popover · Tooltip · Toast · Pagination · Breadcrumb · Timeline · Progress · Skeleton · EmptyState · ErrorState

**Domain components (compose primitives only):**
MemberCard · ProjectCard · CompetitionCard · ActivityCard · KnowledgeCard · SquadCard · TransactionRow · TimelineItem

**Progress (squad stepper):** Research · Problem · Prototype · Testing · Pitch · Submission · Retrospective — rendered as a stepper with text labels (not color alone), current step marked with accent, completed steps with a check, on mobile as a vertical list. Progress fill uses `--ncd-electric`.

**Timeline:** vertical, date in mono at the left (or above on mobile), category badge, outcome text; connecting line `--border`; current/most recent item emphasized by accent dot only.

**Ecosystem diagram:** seven nodes (People, Learn, Connect, Build, Compete, Document, Grow) connected in a loop; a short descriptor per node (from `spec.md` §8.11); built with HTML/SVG, accessible as an ordered list in the DOM; not an image.

Rules: no page defines its own button, card or table styles; no duplicate components; new variants require updating this file.

## 31. Do / Don't

**Do**
- Use tokens, never raw hex.
- Use surface + border to build hierarchy.
- Keep accent for the 7 permitted uses.
- Use Geist Mono for numbers, dates, IDs.
- Show real data or an honest state.
- Design the mobile layout intentionally.
- Write empty/error/loading states for every view.
- Provide visible focus and keyboard paths.
- Label statuses with text.
- Keep Kas visually plain.

**Don't**
- Don't clone Linear (layout, colors, copy).
- Don't use stock photos of smiling people.
- Don't use glassmorphism, neon glows, gradient washes, or floating blobs.
- Don't use pill shapes or 32–40px radii as default.
- Don't put shadows on every card.
- Don't make the whole page purple.
- Don't use semantic colors as decoration.
- Don't rank people. No leaderboards, "Top", "Most active", "#1".
- Don't use `--text-muted` for important information.
- Don't use white small text on `#8B5CF6`.
- Don't invent numbers, achievements, finances, or organizational facts.
- Don't hide all content behind a 30-item hamburger.
- Don't animate for decoration.
- Don't add a library for a single effect.

## 32. Open Design Decisions

| ID | Decision |
|---|---|
| DD-01 | NEXA brand relationship: logo/teal presence, wordmark treatment (`spec.md` D-01, D-02) |
| DD-02 | Light theme: yes / no / later |
| DD-03 | Muted text color: keep `#71717A` with restrictions, or lighten |
| DD-04 | Input border: keep `--border-strong`, or use `--text-muted` for 3:1 |
| DD-05 | UI language(s) and typography implications for Indonesian |
| DD-06 | Mobile type scale values (proposed in §7) |
| DD-07 | Leadership/member photography policy (consent, crop style, background) |
| DD-08 | Whether the authenticated app uses bottom navigation |
| DD-09 | Final placement of Squads/Growth/Kas in app navigation |
| DD-10 | Hero visual: typographic composition + grid, or live activity visual (both are brief-permitted) |
