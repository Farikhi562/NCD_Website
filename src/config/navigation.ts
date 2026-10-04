/**
 * Navigation hierarchy lives here (agents.md §4). Never render every page at once.
 * Source: spec.md §7, design.md §14.
 *
 * PUBLIC  = Discover NCD  (top bar, visitors)
 * /app/*  = Work in NCD   (sidebar, signed-in members)
 */
export type NavItem = { label: string; href: string };
export type NavGroup = { heading: string; items: NavItem[] };

export const publicPrimaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "People", href: "/people" },
  { label: "Projects", href: "/projects" },
  { label: "Competitions", href: "/competitions" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Activities", href: "/activities" },
  { label: "News", href: "/news" },
  { label: "NEXA Tech Labs", href: "/nexa" },
];

/** Logged-out only. Signed-in users never see Login / Register. */
export const publicAuthNav = { login: { label: "Login", href: "/login" }, join: { label: "Join NCD", href: "/register" } };

/** Signed-in sidebar. Three groups, nothing else (design: no crowded sidebar). */
export const appNavGroups: NavGroup[] = [
  {
    heading: "Workspace",
    items: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "People", href: "/app/people" },
      { label: "Projects", href: "/app/projects" },
      { label: "Competitions", href: "/app/competitions" },
      { label: "Knowledge", href: "/app/knowledge" },
      { label: "Activities", href: "/app/activities" },
    ],
  },
  {
    heading: "Organization",
    items: [
      { label: "Squads", href: "/app/squads" },
      { label: "Growth", href: "/app/growth" },
      { label: "Documentation", href: "/app/documentation" },
      { label: "Kas", href: "/app/kas" },
    ],
  },
];

export const footerNav: NavGroup[] = [
  {
    heading: "Explore",
    items: [
      { label: "People", href: "/people" },
      { label: "Projects", href: "/projects" },
      { label: "Competitions", href: "/competitions" },
      { label: "Knowledge", href: "/knowledge" },
      { label: "Activities", href: "/activities" },
      { label: "News", href: "/news" },
      { label: "NEXA Tech Labs", href: "/nexa" },
    ],
  },
  {
    heading: "NCD",
    items: [
      { label: "About", href: "/about" },
      { label: "Transparency", href: "/transparency" },
      { label: "Archive", href: "/archive" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    heading: "Legal",
    items: [{ label: "Terms of Service", href: "/terms" }],
  },
];
