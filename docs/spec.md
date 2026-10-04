# NCD Website — Product Spec

> Single source of truth for **what** the NCD website does and **why**.
> Companion docs: `design.md` (how it looks and feels), `agents.md` (how AI agents build it).

**Status:** Draft v0.1
**Primary source:** *Rancangan NCD satu semester (Oktober 2026 – April 2027), versi update* — referred to below as **the NCD document**.
**Important:** the NCD document describes itself as *"rancangan awal untuk didiskusikan"* — a starting draft for discussion, **not decisions**. Everything in this spec that comes from it inherits that status. Where the NCD document is silent, this spec says `UNDEFINED` or `DECISION NEEDED`. Nothing is invented to fill the gap.

**Legend**

| Tag | Meaning |
|---|---|
| **[NCD-DOC]** | Stated in the NCD document |
| **[BRIEF]** | Stated in the product brief given to the builder (not in the NCD document) |
| `UNDEFINED` | No source defines this |
| `DECISION NEEDED` | A choice must be made by NCD leadership before building |

---

## 1. Product Overview

**Name:** NCD — Digital Home of NCD [BRIEF]
**Organization:** NCD = NEXA Community Development, a division under NEXA ("NEXA / Competition Division" on the NCD document cover). The exact relationship between "NEXA Community Development", "NEXA Tech Labs" (logo) and "NEXA / Competition Division" is `DECISION NEEDED` — see §21.

**One-line definition:** the digital infrastructure that documents, connects, and grows the NCD ecosystem. It is not a company profile and not a generic campus-organization site. [BRIEF]

**Core concept:** `People → Learn → Connect → Build → Compete → Document → Grow` [NCD-DOC §20, BRIEF]

**Tagline:** *Growth Together.* [NCD-DOC cover, §25]

**Where the website sits in NCD's structure:** NCD Website is a **Support System** component, alongside NCD Kas, Documentation and Knowledge Base [NCD-DOC §10, §15, §16]. It is not a program of its own. The NCD document describes it as: *"Tempat perjalanan NCD bisa dilihat, didokumentasikan, dan diteruskan oleh kepengurusan berikutnya."*

**Scope guard from the NCD document:** *"Ini masih konsep organisasi mahasiswa, bukan startup. Fiturnya sederhana dulu, tidak perlu rumit."* [NCD-DOC §16] This sentence constrains MVP scope (§17). The product brief asks for a rich module list; the MVP therefore keeps that list but implements each module at its simplest useful form.

## 2. Problem

From the NCD document [§2]:

1. Members don't all know each other yet.
2. Members still work within their own circles.
3. Team chemistry hasn't formed.
4. Skills are invisible — people differ, but nobody knows who can do what.
5. Experience is uneven (competition and project experience).
6. Passivity risk — without a clear system NCD may be active at the start and then fade.

Additional problems the website specifically addresses [NCD-DOC §20, §23, §25]:

7. Process knowledge gets lost when leadership changes. The website + Knowledge Base exist so *"proses Document tidak hilang saat kepengurusan berganti."*
8. Competitions risk being reduced to *"sekadar kirim poster lomba ke grup"* (Competition Brief exists to prevent this).
9. Organizational resources (NCD Kas) need transparent tracking.

## 3. Goals

| # | Goal | Source |
|---|---|---|
| G1 | Make members and their skills/interests visible to each other | NCD-DOC §12 (Member Development) |
| G2 | Give Competition & Strategy a live, structured database (Competition Radar) and a Brief per competition | NCD-DOC §13 |
| G3 | Show running squads and their progress | NCD-DOC §17 |
| G4 | Showcase NCD projects as case studies / portfolio | NCD-DOC §14, §16 |
| G5 | Make NCD Kas transparent and traceable by members | NCD-DOC §15 |
| G6 | Document activities, retrospectives and achievements as a per-period archive | NCD-DOC §16, §23 |
| G7 | Hold reusable knowledge (sharing materials, tutorials, post-mortems) | NCD-DOC §16 (D) |
| G8 | Survive handover: next leadership inherits the full record | NCD-DOC §23 (Knowledge handover, "Website jadi arsip periode") |
| G9 | Reflect the quality bar of a serious product, not a campus template | BRIEF |

## 4. Non Goals

- Not a company-profile or marketing site.
- Not a leaderboard. No ranking of members, ever. [NCD-DOC §12: *"Growth Map … Bukan sistem ranking."*; BRIEF §19]
- Not a replacement for chat groups or day-to-day messaging. `UNDEFINED` whether any in-site messaging is wanted; default is **no**.
- Not a payment gateway. NCD Kas is a **ledger/recording** system, not a payments system. [NCD-DOC §15: dana masuk > dicatat > dana dipakai > dicatat]
- No complex automation, gamification, or social-network features in MVP. [NCD-DOC §16: "Fiturnya sederhana dulu"]
- No NEXA-wide event management. NEXA Gathering is *"kegiatan NEXA, bukan program eksklusif NCD"* [NCD-DOC §22]. Whether the site documents it is `DECISION NEEDED`.
- No source code, migrations, or deployment in the current phase (documentation only).

## 5. Users

Sizing: about **25** members now, **~30** as a temporary cap [NCD-DOC §2]. The system should be designed for small, human-scale data. Do not over-engineer for scale, but keep the architecture extensible (e.g. future periods, future cohorts).

| User | Description | Primary needs |
|---|---|---|
| **Visitor** | Anyone outside NCD (other students, NEXA members, organizers, prospective members) | Understand what NCD is; see public projects, knowledge, activities |
| **Member** | NCD member (cross-major, cross-year) | See people and skills; find competitions; join squads; read knowledge; see kas |
| **PIC** | Person-in-charge of a task/program (not necessarily the most skilled) [NCD-DOC §18] | Manage the content/work they own |
| **Division Lead** | Head of one of the 3 divisions | Manage division content |
| **Leadership** | Ketua and Wakil Ketua | Organization-level oversight |
| **Admin** | System administration | Configuration, media, access |

## 6. User Roles

Roles requested by the brief: `PUBLIC, MEMBER, PIC, DIVISION_LEAD, LEADERSHIP, ADMIN`.

Mapping to the NCD document:

| System role | NCD-DOC concept | Notes |
|---|---|---|
| `PUBLIC` | — | Unauthenticated visitor |
| `MEMBER` | Anggota NCD | ~25–30 people |
| `PIC` | PIC (Technical, Design, Research, Competition, Documentation) [§18] | PIC is **per task/area, not a global rank**. See below. |
| `DIVISION_LEAD` | "Tiap divisi dipimpin satu ketua divisi" [§10] | Three divisions: People & Culture, Competition & Strategy, Project & Development |
| `LEADERSHIP` | Ketua NCD + Wakil Ketua NCD [§6] | Ketua = direction/decision; Wakil = coordination/execution/monitoring [§11] |
| `ADMIN` | **UNDEFINED** | The NCD document defines no admin/technical-admin role. `DECISION NEEDED`: who holds ADMIN (the NCD Website maintainers? a specific person?) |

**Role modeling notes**

- **PIC scoping.** PICs are assigned per area (e.g. Documentation PIC) and per item (e.g. the PIC of a specific competition in the Radar). Model PIC as an *assignment* attached to a scope, not as a flat global role. Exact PIC types are examples in the NCD document, not a closed list → `DECISION NEEDED` on whether the list is fixed.
- **A person can hold several roles** (e.g. Member + PIC + Division Lead). Authorization is resolved server-side from stored assignments, never from client input.
- **Leadership vs Admin separation.** Leadership manages organizational content; Admin manages the system. Whether Leadership can also act as Admin is `DECISION NEEDED`.
- **Period-bound roles.** Leadership and division leads belong to a *period* (a "kepengurusan"). Role history must survive period change (see §13 Archive).
- **Wakil Ketua monitoring.** Wakil's duty includes monitoring PIC work and deadlines [NCD-DOC §9]. Whether the site provides a monitoring view for that is `DECISION NEEDED` (candidate V1 feature, see §18).

## 7. Information Architecture

URL structure follows the brief [BRIEF §6]. Route presence in this table does not mean the page is in the MVP; see §17.

### Public

```
/
├── about
├── people
├── activities
├── projects
├── competitions
├── knowledge
├── transparency
└── archive
```

### Authenticated (`/app`)

```
/app
├── dashboard
├── people
├── activities
├── projects
├── competitions
├── squads
├── knowledge
├── growth
├── documentation
└── kas
```

### Admin (`/admin`)

```
/admin
├── overview
├── members
├── activities
├── projects
├── competitions
├── knowledge
├── documentation
├── kas
├── media
└── settings
```

**Navigation rules** [BRIEF §6, §16]

- Never show every page in navigation at once; navigation follows information hierarchy.
- Public primary nav: **People · Projects · Competitions · Knowledge · Activities** — and **About**, **Login** at the right.
- Authenticated nav: **Overview · People · Projects · Competitions · Knowledge · Activities · Transparency**. Squads, Growth, Documentation and Kas are reached from Overview, contextual links and a command/search surface, not as extra top-level items. Final placement of Squads / Growth / Kas in authenticated nav is `DECISION NEEDED`.
- Admin has a separate navigation.
- Mobile: compact top bar + drawer/sheet; bottom navigation only if it fits the context. No giant hamburger menus.

**Tension to resolve (flagged, not hidden).** The brief has both a public `/transparency` page and a strict-access `/app/kas`. The NCD document says kas should be *"Bisa dilihat anggota"* (members can view it) [§15] and that Transparency covers *"Informasi kas, laporan kegiatan, dokumentasi penggunaan dana jika relevan"* [§16-A]. It does not say whether outsiders may see the kas. → `DECISION NEEDED` (see §21, D-03).

## 8. Core Modules

Each module below lists its purpose, its source in the NCD document, and the minimum it must do.

### 8.1 About / Organization Profile
Source: NCD-DOC §4, §5, §6, §10, §16-E.
Shows: vision, mission, five values, leadership, structure (3 divisions + Support System + Competition Squad), short member-facing explanation of "Growth Together".

Content that **may** be used as written in the NCD document (still a draft, so confirm before launch):
- Vision (§4): *Menjadi wadah pengembangan mahasiswa lintas bidang yang mendorong anggota untuk belajar, berkolaborasi, membangun karya, dan berkembang melalui pengalaman kompetisi.*
- Mission — *marked "usulan, bisa diubah"* (§4): four items — introduce members and skills; build learning/sharing habits; make projects and join competitions cross-major and cross-year; evaluate and document every experience.
- Values (§5): **Growth, Collaboration, Ownership, Learning, Contribution**.
- Leadership (§6): Ketua NCD — Mirza Danisywar Noor Wahyu; Wakil Ketua NCD — Muhamad Fauzan Al Farikhi.

`DECISION NEEDED`: use of leadership **photos** on a public page needs the individuals' consent and a decision on which photos to use. Do not copy photos from the PDF into the repository without that approval.

### 8.2 People (Member Development)
Source: NCD-DOC §12.
Member profile fields the NCD document lists for mapping: **jurusan, angkatan, skill, minat, pengalaman, target pribadi, minat kompetisi**. Plus division/NCD role (brief example shows "NCD · Project & Development").

- No ranking, badges like "Top Member", "Most Active", or "#1". [BRIEF §19, NCD-DOC §12]
- **Privacy split (DECISION NEEDED).** *Target pribadi* (Growth Map) and *pengalaman* can be personal. The NCD document doesn't say which fields are public, member-only, or private. Default until decided: **public shows only name, major, cohort, division, skill tags that the member chose to publish; everything else is member-only or owner-only.** Public people page may even be **off** until members consent → `DECISION NEEDED`.
- Members control their own profile fields where possible (owner edits own data); changes to organizational assignments go through Division Lead / Leadership.

### 8.3 Growth Map
Source: NCD-DOC §12.
*"Setiap anggota punya target perkembangan. Bukan sistem ranking."* *"Yang dibandingkan adalah diri sendiri di awal dan di akhir semester, bukan antar anggota."* Question it answers: *"Saya mulai dari mana, dan semester ini berkembang ke mana?"*

- Per-member: starting point, semester target, end-of-semester reflection.
- **Never** compare members. No cross-member charts, sorting, or averages shown to members.
- Visibility: owner + (probably) their Division Lead / Leadership. `DECISION NEEDED`.
- Exact structure of a "target" (free text? skill + level?) is `UNDEFINED`.

### 8.4 Activities & Documentation
Source: NCD-DOC §16-B, §21, §25 (brief).
Activity timeline fields [BRIEF §25]: **Date, Activity, Category, Participants, Documentation, Outcome.**

Categories from the brief: **Learning, Connect, Project, Competition, Organization.** The NCD document's programs map as follows (informational): NCD Discover / NCD Grow → Learning; NCD Connect → Connect; Project Lab / Project Clinic → Project; Competition Day / Retrospective → Competition; Kas / Website / organizational items → Organization. The categorization of each program is `DECISION NEEDED`; Discover and Demo Day have no obvious category yet.

Documentation is the raw record; it must be usable later as an archive (see 8.9).

Programs that exist in the NCD document and are candidates to appear as activities [§21]: NCD Discover, NCD Connect, NCD Grow, Competition Day, Retrospective, Project Clinic, Demo Day, and (optionally) NEXA Gathering.

### 8.5 Projects (Project Lab)
Source: NCD-DOC §14; BRIEF §20.
Project Lab flow: **Idea → Problem → Research → Solution → Prototype → Test → Improve → Submit.**
A project is **not necessarily for a competition**; it can be portfolio, experiment, research, or learning [§14].

- Card: name, short description, tags (e.g. AI · Data · Web), status, team, period.
- Detail = case study: Overview, Problem, Research, Solution, Build, Team, Timeline, Outcome, Retrospective [BRIEF §20].
- **Project Clinic** (pre-submission review) outputs *catatan perbaikan untuk squad* [§14]. Whether clinic notes are stored/shown on the site is `DECISION NEEDED`.
- Project status vocabulary is `UNDEFINED` in the NCD document. Proposed minimum for the UI (needs confirmation): `Draft · In progress · Completed · Archived`. Do not show statuses outside this agreed list.
- Public vs member-only visibility is set per project (e.g. an unfinished competition entry may be confidential before submission). `DECISION NEEDED`: default visibility.

### 8.6 Competitions (Competition Radar + Brief)
Source: NCD-DOC §13; BRIEF §21.

**Competition Radar** fields per NCD document: *nama, penyelenggara, bidang, deadline, eligibility, requirement, status, PIC.* Output: *"database yang aktif dan selalu diperbarui."*
(The brief's list view columns — Competition, Category, Deadline, Eligibility, Status, PIC — are a subset; **Organizer** and **Requirements** are in the NCD document and must be stored.)

**Competition Brief** (one per competition) fields per NCD document: *kompetisinya apa, masalah yang dibawa, siapa yang cocok, kebutuhan, deadline, tingkat kesiapan.* Purpose: so NCD does not merely forward posters. A poster alone is not a valid brief.

Competition detail sections [BRIEF §21]: Overview, Problem, Requirements, Eligibility, Timeline, Judging, Required Skills, Team, Status.
→ Judging system: the NCD document lists *"sistem penilaian"* among things to analyze [§13]. It maps to **Judging**.

- Filters per brief: All / AI / Business / Design / Programming / Research. The NCD document says only "bidang" without a list → category list is `DECISION NEEDED` (the brief's list is used as a starting proposal).
- Status vocabulary is `UNDEFINED` in the NCD document. Candidate (needs confirmation): `Watching · Open · In progress · Submitted · Closed`. `DECISION NEEDED`.
- **Competition flow** [§13]: Find → Filter → Analyze → Team Formation → Plan → Submit → Evaluate.
- **Readiness level** ("tingkat kesiapan") scale is `UNDEFINED`.
- Deadlines are shown in Geist Mono with an explicit timezone rule (`DECISION NEEDED`: Asia/Jakarta default).

### 8.7 Squads
Source: NCD-DOC §17; BRIEF §22.
**Divisions are permanent; squads are temporary.** Squad = temporary team formed per competition or project; members can come from any division, major and cohort.

- Show: squad name, linked competition/project, status, members, roles, progress.
- Example squad roles in the NCD document: **Technical, Business, Design, Presentation** (examples, not a fixed list).
- **Squad lifecycle** [NCD-DOC §17]: Ada kompetisi → Squad dibentuk → Kerja bareng → Evaluasi → Dokumentasi → Knowledge → Squad selesai.
- **Progress stages** shown in UI [BRIEF §22]: Research · Problem · Prototype · Testing · Pitch · Submission · Retrospective. The lifecycle above and the progress stages are two different axes (lifecycle = squad status; progress = work stage). Do not merge them silently. How progress is updated (manual vs derived) is `DECISION NEEDED`.
- Team formation uses the member mapping (skills, interests, competition interest) [§13, §19].
- Finished squads are **archived, never deleted**.

### 8.8 Knowledge Base
Source: NCD-DOC §16-D, §13 (Retrospective feeds Knowledge Base).
What the NCD document says belongs here: *materi sharing, tutorial, insight competition, technical knowledge, proposal dan pitching knowledge, post-mortem.*

- Article: title, category, author, updated date, reading time, content, related knowledge / projects / competitions [BRIEF §23].
- Category list from the brief: Technical, Competition, Business, Design, Research, General. The NCD document gives no category list → `DECISION NEEDED` (brief list = starting proposal).
- Search is the priority interaction; readability is the second [BRIEF §23].
- **Retrospective → Knowledge pipeline.** Retrospectives after competitions feed the Knowledge Base [§13]. The NCD document says Retrospective uses *"enam pertanyaan yang sama"* (six identical questions) but **the six questions are not written down in the document** → `UNDEFINED`. The retrospective data model must therefore use a configurable question set, not hard-coded fields. `DECISION NEEDED`: provide the six questions.
- Public vs member-only per article. `DECISION NEEDED`: default.
- Authoring format (Markdown vs rich text): `DECISION NEEDED`. User-generated content is sanitized either way (see §20).

### 8.9 Archive (per-period)
Source: NCD-DOC §23 (Late period: "Website jadi arsip periode", "Knowledge handover"), BRIEF §26.
- Archive is organized per **period**. The first period is **October 2026 – April 2027** (NCD document), which the brief labels `2026/2027`. Exact start/end dates are `UNDEFINED` ("Tanggal pasti belum ditentukan" [§23]).
- Each period contains: People, Activities, Projects, Competitions, Knowledge, Retrospectives, Achievements.
- **Historical data is never deleted when a period changes.** Period change = new period record + role reassignment; old rows remain linked to their period.
- **Achievements** have no definition in the NCD document beyond a mention in §16 (Documentation/Portfolio). No fake achievements, ever. `DECISION NEEDED`: what counts as an achievement (the NCD document stresses *"Kemenangan bukan satu-satunya ukuran"* [§24] — an achievement can be a process milestone, not only a win).
- Whether a period is called "semester" or "kepengurusan" in the UI: **the NCD document uses both** ("satu semester", "satu periode"). `DECISION NEEDED`: pick one term; this spec uses **period** as the neutral term.

### 8.10 NCD Kas (and Transparency)
Source: NCD-DOC §15; BRIEF §24.
*"NCD Kas = dana bersama + sistem pencatatan yang transparan."*
Used for: operational needs, small project/competition costs, consumption/internal events, bonding and activities, other things agreed together.

- **Flow:** Dana masuk → Dicatat → Dana dipakai → Dicatat → Saldo diperbarui → Bisa dilihat anggota.
- **Record fields** [NCD-DOC]: **Tanggal, Keterangan, Pemasukan, Pengeluaran, Saldo.** Nothing else is required by the NCD document.
- **Contribution (iuran) amount and balance target are not decided.** *"Nominal iuran dan target saldo belum ditentukan."* Therefore: no amount, no target, no default. The UI must show these as `Not available` until set by leadership. → `UNDEFINED`.
- The system is a **ledger**. It does not move money. The NCD document does not define who holds the cash (bendahara) — **there is no treasurer role in the NCD document**. → `DECISION NEEDED`: who may write kas entries (candidate: a designated PIC or Leadership).
- **Entry integrity (proposal, needs approval):** entries are append-only; corrections are made by a reversing/adjusting entry, not by editing or deleting. Running balance is computed, not typed by hand. `DECISION NEEDED` — this is an engineering safeguard suggested by this spec, not a requirement from the NCD document.
- Supporting documentation for spending (receipt/photo) — mentioned only as *"dokumentasi penggunaan dana jika relevan"* [§16-A] → optional attachment. `DECISION NEEDED` on storage and visibility.
- No fake numbers anywhere, including seed data, screenshots, and staging, unless clearly labeled as test data and excluded from production.

### 8.11 Home / Current Pulse
Source: BRIEF §17–18.
Homepage is an editorial product landing page. Hero copy from the brief: **"NCD — Growth Together. Meet people. Learn together. Build things. Compete. Document what happened. Grow from it."** CTAs: **Explore NCD** (primary), **View Projects** (secondary).

Section order: Hero → Current Pulse → People → Projects → Competitions → Activities → Knowledge → Ecosystem → Footer.

**Current Pulse:** live counts (e.g. active projects, active competitions, learning sessions). A number is shown **only if it is computed from the database**. Otherwise show an honest state (`Not yet documented`). The numbers in the brief are *format examples*, not data.

**Ecosystem** section visualizes the seven-stage cycle (People → Learn → Connect → Build → Compete → Document → Grow). Descriptions per stage come from NCD-DOC §20:
- People: get to know members, skills, interests, experience, targets.
- Learn: learn from and share with each other.
- Connect: members across majors and cohorts build relationships.
- Build: form projects and apply skills.
- Compete: take projects into competitions.
- Document: record process, results, failures, learnings.
- Grow: experience becomes knowledge for members and the next leadership.

### 8.12 Authentication
Source: BRIEF §3.
Email/password, password reset, protected routes; magic link "if needed" (`DECISION NEEDED`).
**Who may register** is `UNDEFINED`: the NCD document has no membership/onboarding process. Default proposal: **invite-only / admin-approved**; open sign-up is not assumed. `DECISION NEEDED`.

## 9. Feature Requirements

Priority key: **M** = MVP, **V1**, **F** = Future. (Phasing detail in §17–19.)

| ID | Requirement | Module | Phase |
|---|---|---|---|
| F-01 | Public landing page with hero, ecosystem visual, links into modules | Home | M |
| F-02 | About page: vision, mission, values, leadership, structure | About | M |
| F-03 | Public + authenticated navigation per §7 | Nav | M |
| F-04 | Login, logout, password reset; protected `/app` and `/admin` | Auth | M |
| F-05 | Member profiles with mapping fields (§8.2) | People | M |
| F-06 | Division and role display (3 divisions, Ketua/Wakil, PIC) | People | M |
| F-07 | Competition Radar list with filter and detail | Competitions | M |
| F-08 | Competition Brief attached to a competition | Competitions | M |
| F-09 | Project list + case-study detail | Projects | M |
| F-10 | Activity timeline with category | Activities | M |
| F-11 | Knowledge article list, detail, search, categories | Knowledge | M |
| F-12 | NCD Kas: read view (summary + transaction table) for permitted members | Kas | M |
| F-13 | NCD Kas: write entries by authorized role | Kas | M |
| F-14 | Squad list + detail (members, roles, progress) | Squads | V1 |
| F-15 | Growth Map per member | Growth | V1 |
| F-16 | Retrospective capture (configurable questions) + link to Knowledge | Retro | V1 |
| F-17 | Per-period archive pages | Archive | V1 |
| F-18 | Admin screens for members, content, media | Admin | M (minimal) / V1 |
| F-19 | Team Formation helper: filter members by skill/interest for a squad | Squads | V1 |
| F-20 | Wakil monitoring view (PIC deadlines, stuck items) | Monitoring | F (DECISION NEEDED) |
| F-21 | Demo Day showcase page | Activities | F (DECISION NEEDED) |
| F-22 | Command palette / keyboard search | Global | V1 |
| F-23 | Document/media library (`documents`, `media_assets`) | Admin | V1 |

Cross-cutting requirements:
- Every list has loading (skeleton), empty, and error states (see §14).
- Every content type has an owner (PIC) and a last-updated timestamp.
- Dates/timestamps stored in UTC, displayed per the timezone decision (`DECISION NEEDED`, default Asia/Jakarta).
- UI language: the brief's copy is in **English**; the NCD document and members are Indonesian. `DECISION NEEDED`: English only, Indonesian only, or bilingual (affects routing, content model, SEO). Default for implementation planning: English interface chrome, content in whichever language the author wrote it.

## 10. Data Requirements

> The brief explicitly says: *do not finalize the schema blindly*. This section defines **entities and what is known**; it is not a migration. Fields marked `UNDEFINED` or `DECISION NEEDED` must not be invented in code.

**Entity list (from the brief):** `profiles, members, divisions, roles, skills, member_skills, activities, activity_members, projects, project_members, project_tags, competitions, competition_briefs, competition_squads, squad_members, knowledge_articles, knowledge_categories, retrospectives, kas_accounts, kas_transactions, documents, media_assets, periods`

| Entity | Purpose | Known fields / source | Open |
|---|---|---|---|
| `profiles` | Auth-linked identity | name, avatar | link to `members`: 1:1? |
| `members` | NCD member record | jurusan, angkatan, interests, experience, personal target, competition interest [NCD-DOC §12] | field visibility per field; "personal target" may live in a separate Growth entity |
| `divisions` | The 3 permanent divisions | People & Culture; Competition & Strategy; Project & Development [§10] | whether Support System items are divisions: **No** per NCD-DOC (they are "Support System") |
| `roles` | Role definitions + assignments | Ketua, Wakil, Division Lead, PIC types, Member | period-bound; ADMIN source `UNDEFINED`; assignment-with-scope model |
| `skills` | Skill vocabulary | — | list `UNDEFINED`; who curates; levels `UNDEFINED` |
| `member_skills` | Member ↔ skill | — | self-declared vs verified: `DECISION NEEDED` |
| `activities` | Timeline entries | date, activity, category, participants, documentation, outcome [BRIEF §25] | category set |
| `activity_members` | Participants | — | — |
| `projects` | Project Lab items | name, description, status, period, case-study sections [BRIEF §20] | status values; visibility |
| `project_members` | Team | member + role in project | role vocabulary |
| `project_tags` | Tags (AI, Data, Web, …) | — | tag list |
| `competitions` | Radar rows | nama, penyelenggara, bidang, deadline, eligibility, requirement, status, PIC [NCD-DOC §13] | status values; category list |
| `competition_briefs` | One brief per competition | kompetisi, masalah, siapa cocok, kebutuhan, deadline, tingkat kesiapan [NCD-DOC §13] | readiness scale |
| `competition_squads` | Squad ↔ competition/project | squad name, status, progress stage | squad can link to a **project** without a competition [BRIEF §22, NCD-DOC §14]; model must allow either |
| `squad_members` | Squad membership | member + squad role (Technical/Business/Design/Presentation = examples) | role vocabulary |
| `knowledge_articles` | KB content | title, category, author, updated, content, relations [BRIEF §23] | format; visibility |
| `knowledge_categories` | KB taxonomy | — | list |
| `retrospectives` | Post-competition evaluation | six questions (**not provided**) [§13] | questions `UNDEFINED`; must be configurable |
| `kas_accounts` | Kas container | — | single account vs several: `UNDEFINED` (NCD-DOC describes one "NCD Kas") |
| `kas_transactions` | Ledger entries | tanggal, keterangan, pemasukan, pengeluaran, saldo [§15] | append-only rule; attachments |
| `documents` | Files (proposals, reports, receipts) | — | types, visibility |
| `media_assets` | Images/videos for documentation | — | storage rules |
| `periods` | Kepengurusan/semester | name, start, end | first period Oct 2026–Apr 2027, exact dates `UNDEFINED` |
| `membership_applications` | Membership intake (`/join` → admin review) [D-05] | user_id, full_name, npm, university (fixed `Universitas Gunadarma`), faculty, study_program, semester (1–14), email, whatsapp, motivation, skills, contribution, document_type (KRS/KTM), document_path, status (`pending` → `under_review` → `approved`/`rejected`), submitted_at, reviewed_at, member_id, review_note (admin-only) | Re-application after rejection allowed; blocked while open / once approved. Approved row creates the `members` record (migration 004) |
| `ncd_membership_config` | Capacity switch | `max_members` (31), updated_at | Raising/lowering the cap is an admin decision; read via `ncd_membership_capacity()` RPC |
| `email_outbox` | Notification queue | recipient, subject, body, kind, status (`pending`/`sent`/`failed`), related_application_id | Provider `DECISION NEEDED` (D-26); rows are written by trigger, delivered server-side |

**Relational rules**
- Every record that can differ across time (members' roles, activities, projects, competitions, squads, retrospectives, kas entries) belongs to a `period`.
- No hard deletion of historical content; use archive/soft-delete flags.
- Ownership: each content record stores `created_by` and (where relevant) a responsible PIC.
- Roles are assignments with a scope (global, division, project, competition, squad, area).

## 11. Permissions

Principle: **deny by default; grant by role + scope; enforce in the database (Supabase RLS) and again on the server. Never trust a role sent from the client.** [BRIEF §5, §35]

Baseline matrix (R = read, W = create/edit own scope, M = manage all in scope, — = none). This is the **proposed starting point**; cells marked ⚠ need a decision.

| Content | PUBLIC | MEMBER | PIC | DIVISION_LEAD | LEADERSHIP | ADMIN |
|---|---|---|---|---|---|---|
| About / org profile | R | R | R | R | M | M |
| People (public fields) | R ⚠ | R | R | R | M | M |
| People (member-only fields) | — | R | R | R | M | M |
| Own profile + Growth Map | — | W (own) | W (own) | W (own) | W (own) | W (own) |
| Others' Growth Map | — | — | — ⚠ | R ⚠ (own division) | R ⚠ | — ⚠ |
| Activities (public) | R | R | W (owned) | M (division) | M | M |
| Projects (public) | R | R | W (owned) | M (division) | M | M |
| Projects (internal) | — | R | W (owned) | M (division) | M | M |
| Competition Radar / Brief | R ⚠ | R | W (as PIC) | M (C&S) | M | M |
| Squads | R (public ones) ⚠ | R | W (as PIC) | M | M | M |
| Knowledge (public) | R | R | W (owned) | M (division) | M | M |
| Knowledge (internal) | — | R | W | M | M | M |
| Retrospectives | — | R ⚠ | W (as PIC) | M | M | M |
| **NCD Kas (read)** | R? ⚠ | R | R | R | R | R ⚠ |
| **NCD Kas (write)** | — | — | — | — | W ⚠ | — ⚠ |
| Media / documents | per item | per item | W (owned) | M | M | M |
| Settings / members admin | — | — | — | — | partial ⚠ | M |

Rules:
1. **NCD Kas** has the strictest policy: separate RLS policies; writes only by an explicitly authorized role (`DECISION NEEDED`); no client-side computed trust; every change audit-logged. Admin being able to *read* kas is itself a decision (system admin ≠ treasury authority).
2. **Division scope.** A Division Lead manages content belonging to their division only (Competition & Strategy lead → Radar/Briefs; Project & Development lead → Projects; People & Culture lead → mapping, Learning, Connect). Cross-division edits need Leadership.
3. **PIC scope** is limited to items they are assigned to.
4. **Leadership** manages organization-level content (About, periods, assignments).
5. **Role changes are themselves privileged actions** and logged.
6. **Internal pages are never indexed** and never served unauthenticated.

## 12. States

Every data-driven view must define: **loading, empty, error, partial, populated**, plus **permission-denied** and **not-found**.

- **Loading:** skeleton that mirrors the real layout.
- **Empty (informational, not cute):** e.g. *No projects yet. Projects created by NCD will appear here.* A create CTA appears **only** if the viewer has permission to create. [BRIEF §28]
- **Error:** short, clear, non-blaming, with recovery (e.g. *Something went wrong. We couldn't load the projects. Try again*). [BRIEF §30]
- **Unavailable data states:** `Not available`, `Not yet documented`, `Coming soon`. [BRIEF §41]
- **Permission denied:** state what is restricted and how to get access; don't expose that restricted content exists beyond what's necessary. `DECISION NEEDED`: whether restricted items are hidden entirely or shown as locked.
- **Status badges** use semantic colors only for semantic meaning (see `design.md`).

Examples of required empty states: People, Projects, Competitions, Squads, Knowledge, Activities, Archive (per period), Kas (no entries yet — with `Rp …` balance shown as `Not available`, not `Rp 0`, unless the balance truly is zero).

## 13. Archive & Period Lifecycle

1. A `period` is created by Leadership.
2. All period-scoped records attach to it.
3. At period end (Late period: Retrospective, Portfolio project, Laporan kegiatan, Evaluasi growth, Dokumentasi semester, Knowledge handover [NCD-DOC §23]) Leadership marks the period **closed**. Closed = read-mostly; still readable forever.
4. A new period starts with its own leadership assignments; members carry over as members; squads do not carry over (squads are temporary).
5. Archive pages render a period's People, Activities, Projects, Competitions, Knowledge, Retrospectives, Achievements.

`DECISION NEEDED`: what exactly "handover" produces in the site (a checklist? a document?), and whether members' personal Growth Map data is archived, anonymized, or kept private after the period.

## 14. MVP

Guided by the NCD document's own roadmap and scope guard.

**Why this MVP.** The roadmap [NCD-DOC §23] says: Early period → *"Mulai website structure"*; Middle period → *"Website mulai menampilkan activity dan project"*; Late period → *"Website jadi arsip periode."* The website grows with the semester. MVP therefore targets the **early-to-middle** need: identity, people, competitions, activities, projects, kas, knowledge — not the archive finale.

**MVP includes**
- Public: Home, About, People (subject to consent decision), Projects, Competitions (Radar + Brief), Knowledge, Activities.
- Auth + `/app/dashboard`.
- Member profiles with mapping fields; division and role display.
- Competition Radar + Brief CRUD for authorized roles.
- Activities timeline + project listing with case-study detail.
- Knowledge articles with search.
- NCD Kas: read for members; write for the authorized role.
- Minimal `/admin` for members, content, media.
- Core quality bar: accessibility, responsive, SEO for public pages, RLS on sensitive tables.

**MVP excludes (→ V1 / Future):** Squad progress tracking UI, Growth Map, Retrospective forms, Archive pages beyond a simple period list, command palette, monitoring view, Demo Day page.

## 15. V1

Squads and Team Formation helper; Growth Map; Retrospective capture feeding Knowledge; per-period Archive pages; media/document library; command palette; richer admin; Project Clinic notes (if approved).

## 16. Future

Wakil monitoring dashboard (PIC deadlines, stuck items); Demo Day showcase; handover tooling; multi-period analytics; notifications; integrations with whatever tools NCD actually uses (`UNDEFINED`: the NCD document names none); additional NEXA-wide pages if NEXA wants a shared site.

## 17. Analytics

The NCD document wants **capaian proses, not just wins** [§24]. Its achievement groups, which suggest what the site can *measure from real data*:

| Area | Measurable from the site (only from real records) |
|---|---|
| People | Members mapped; members with a Growth target; (cross-major interaction **cannot** be measured by the site without a definition) |
| Learning | Learning sessions recorded; knowledge articles published |
| Project | Projects and squads created; prototypes recorded |
| Competition | Radar entries; briefs written; squads formed; submissions; retrospectives completed |
| Transparency | Kas updated regularly (last-updated age); entries traceable |
| Documentation | Activities/projects/retrospectives documented |
| Digital presence | Site live; org info available; portfolio items; knowledge usable |

Rules:
- **No target numbers.** The NCD document says: *"Belum ada angka target karena belum ada data kapasitas anggota."* The site must not display targets, quotas, or progress-to-goal percentages until leadership defines them.
- **No leaderboards** or per-member comparison metrics.
- **Product analytics** (page views etc.): `DECISION NEEDED` — privacy-friendly, aggregated, no per-member tracking for internal pages. Default: none until decided.
- Everything shown on Current Pulse must be a live query.

## 18. SEO

Public pages: metadata, title, description, Open Graph, canonical URL; site-wide `sitemap.xml` and `robots.txt`. Public project and knowledge pages indexable **only if marked public**. `/app/*` and `/admin/*` are `noindex` and disallowed in robots. Kas and Growth are never indexable. People pages: indexing depends on the consent decision (default `noindex` until decided). Per-page OG images generated, not stock photos. Domain/canonical host: `UNDEFINED`.

## 19. Security

- Secrets only in environment variables; `SUPABASE_SERVICE_ROLE_KEY` never in client code or bundles. [BRIEF §35]
- Sensitive operations (role changes, kas writes) run server-side.
- RLS on all tables holding non-public data; **NCD Kas** has dedicated, minimal policies.
- Validate all input on the server; sanitize user-generated content (Markdown/HTML) before storing and rendering.
- Role comes from the database, never from the request.
- Storage buckets: private by default; public only for assets explicitly marked public.
- Audit log for kas writes, role changes, publication-status changes. (Proposal; `DECISION NEEDED`.)
- Personal data minimization: store only the member fields listed in the NCD document; personal targets are private by default.
- Data about people (photos, majors, skills) requires awareness/consent before public display. `DECISION NEEDED`: consent mechanism.

## 20. Performance

- Server Components by default; Client Components only where interaction/state requires. [BRIEF §2]
- Optimize images with Next.js image handling; lazy-load below the fold.
- Data volume is small (~25–30 members), so prefer simple queries; avoid heavy dependencies.
- No library for a single trivial animation.
- Skeletons for slow views; paginate lists beyond a small threshold.
- Targets (to be validated, not guaranteed): fast first load; Core Web Vitals in the "good" range on mid-range phones.

## 21. Open Decisions

Tracked here so nothing is silently assumed. Priority: **P0** blocks MVP; **P1** blocks V1; **P2** can wait.

| ID | Pri | Decision | Why it's open |
|---|---|---|---|
| D-01 | P0 | **Relationship & naming**: is NCD "NEXA Community Development" or "NEXA Competition Division"? What is NEXA Tech Labs's relation? Does the site live under a NEXA brand? | The NCD document cover says "Competition Division"; the brief says "Community Development". |
| D-02 | P0 | **Brand colors**: NCD document uses a teal/navy NEXA visual identity; the brief mandates a dark neutral + violet identity. Does NCD diverge from NEXA branding? Logo usage? | See `design.md` §1 |
| D-03 | P0 | **Kas visibility**: public, members only, or leadership only? Who can write entries (no treasurer role exists)? | NCD-DOC says "bisa dilihat anggota" only |
| D-04 | P0 | **Who is ADMIN**; can LEADERSHIP act as ADMIN? | No admin role in NCD-DOC |
| D-05 | P0 | **Membership & sign-up flow** — *decided 2026-10-05*: public application on `/join` → admin review → approve/reject; hard cap `max_members = 31`; approval creates the `members` row | No onboarding defined |
| D-06 | P0 | **Public people page**: consent model, which fields public | Privacy |
| D-07 | P0 | **UI language** (EN / ID / both) | Brief in English; org in Indonesian |
| D-08 | P1 | Retrospective **six questions** | Mentioned, not written |
| D-09 | P1 | Competition **category list**, **status list**, **readiness scale** | NCD-DOC: "bidang" only |
| D-10 | P1 | Project status vocabulary and default visibility | Not defined |
| D-11 | P1 | Knowledge category list and authoring format | Not defined |
| D-12 | P1 | PIC types: closed list or free? | NCD-DOC gives examples only |
| D-13 | P1 | Growth Map: structure and who sees it | Only intent defined |
| D-14 | P1 | Squad progress: manual vs derived; squad role list | Not defined |
| D-15 | P1 | Achievements: definition | Not defined; "bukan cuma menang" |
| D-16 | P1 | Period naming ("semester" vs "periode"); exact period dates | NCD-DOC uses both; dates not set |
| D-17 | P1 | Where do NEXA Gathering and Demo Day live on the site? | Gathering is NEXA-wide; Demo Day is NCD end-of-semester |
| D-18 | P2 | Kas: iuran amount, balance target (**decided by members first**), attachments, append-only policy | NCD-DOC: "belum ditentukan" |
| D-19 | P2 | Skills vocabulary and levels | Not defined |
| D-20 | P2 | Magic link auth | "jika diperlukan" |
| D-21 | P2 | Timezone default (proposed Asia/Jakarta) | Unstated |
| D-22 | P2 | Product analytics tooling and privacy | Not defined |
| D-23 | P2 | Domain / canonical host / hosting | Not defined |
| D-24 | P2 | Leadership photo usage and consent | PDF contains photos |
| D-25 | P2 | Monitoring view for Wakil | Role implies it; feature not specified |
| D-26 | P2 | **Email provider** for application notifications | Outbox records `nexatechlabs271@gmail.com` notifications; `RESEND_API_KEY` transport is optional and unverified until a provider is chosen |

### Observed gaps between the brief and the NCD document

These are the places where the brief goes **beyond** what the NCD document specifies. They are kept so developers know what is requirement vs. proposal:

1. **Brief-only structures:** `/transparency`, `/archive`, `/growth`, `/squads`, and the Admin section are brief proposals; the NCD document defines the *concepts* (transparency, documentation, growth map, squad) but not these routes.
2. **Brief-only vocabularies:** competition filters (AI/Business/Design/Programming/Research), knowledge categories, activity categories, squad progress stages.
3. **Brief-only roles:** `ADMIN`; `LEADERSHIP` as a combined role.
4. **NCD-document items the brief doesn't mention but the site should not lose:** Project Clinic, Competition Day (5-min pitch + 5-min feedback), Demo Day, NEXA Gathering (optional), Growth Map, readiness level in briefs, "organizer" field in Radar.

## Appendix A — NCD facts used (verbatim reference)

- Members: ~25 now, ~30 temporary cap. Roadmap: Oct 2026 Foundation · Nov Connection & Learning · Dec Build · Jan Compete · Feb Improve · Mar Reflect · Apr cadangan (reserve). Exact dates not set.
- Structure: Ketua, Wakil; 3 divisions (People & Culture, Competition & Strategy, Project & Development); Support System (NCD Kas, NCD Website, Documentation, Knowledge Base); Competition Squad (temporary). No deputy, no layered secretariat, no sub-divisions.
- Division programs: **P&C** — NCD Discover, NCD Connect, NCD Grow, Growth Map. **C&S** — Competition Radar, Competition Brief, Competition Day, Retrospective. **P&D** — Project Lab, Project Clinic. **NEXA-wide:** NEXA Gathering (optional). **Semester close:** Demo Day (all squads present, including failed ones).
- Growth Together chain: Build People > Build Skill > Build Project > Build Competition Experience > Build Knowledge.
- Values: Growth, Collaboration, Ownership, Learning, Contribution.
- Cross-division flow: Mapping (P&C) → Radar & Brief (C&S) → Squad formed (C&S) → Project Lab (P&D) → Project Clinic (P&D) → Competition Day (C&S) → Submit (C&S) → Retrospective (All) → Knowledge Base & growth review (P&C). Wakil monitors the whole flow.
