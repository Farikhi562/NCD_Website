/**
 * Navigation hierarchy lives here (agents.md §4). Never render every page at once.
 * Source: spec.md §7, design.md §14.
 * DECISION NEEDED(DD-09): placement of Squads / Growth / Kas in authenticated nav.
 */
export type NavItem = { label: string; href: string };

export const publicPrimaryNav: NavItem[] = [
  { label: "People", href: "/people" },
  { label: "Projects", href: "/projects" },
  { label: "Competitions", href: "/competitions" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Activities", href: "/activities" },
];

export const publicSecondaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
];

export const appNav: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "People", href: "/app/people" },
  { label: "Activities", href: "/app/activities" },
  { label: "Projects", href: "/app/projects" },
  { label: "Competitions", href: "/app/competitions" },
  { label: "Squads", href: "/app/squads" },
  { label: "Knowledge", href: "/app/knowledge" },
  { label: "Growth", href: "/app/growth" },
  { label: "Documentation", href: "/app/documentation" },
  { label: "Kas", href: "/app/kas" },
];

export const appSecondaryNav: NavItem[] = [
  { label: "Profile", href: "/app/profile" },
  { label: "Logout", href: "/logout" }, // handled client-side
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Explore",
    items: [
      { label: "People", href: "/people" },
      { label: "Projects", href: "/projects" },
      { label: "Competitions", href: "/competitions" },
      { label: "Knowledge", href: "/knowledge" },
      { label: "Activities", href: "/activities" },
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
];
