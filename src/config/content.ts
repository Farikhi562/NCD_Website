/**
 * UI copy that needs central control (agents.md §4, design.md §29).
 * DECISION NEEDED(D-07): UI language (EN / ID / both). Strings live here so
 * they can be translated without redesign. Interface chrome is English for now.
 */
export const site = {
  name: "NCD",
  tagline: "Growth Together.",
  description:
    "NCD is the digital home where people, learning, projects, competitions and records connect. Meet people. Learn together. Build things. Compete. Document what happened. Grow from it.",
};

export const hero = {
  title: "NCD",
  headline: "Growth Together.",
  lines: ["Meet people.", "Learn together.", "Build things.", "Compete.", "Document what happened.", "Grow from it."],
};

/** Ecosystem stages and descriptors: spec.md §8.11 (from NCD document §20). */
export const ecosystem = [
  { name: "People", text: "Get to know members, skills, interests, experience and targets." },
  { name: "Learn", text: "Learn from each other and share what you know." },
  { name: "Connect", text: "Build relationships across majors and cohorts." },
  { name: "Build", text: "Form projects and put skills to work." },
  { name: "Compete", text: "Take projects into competitions." },
  { name: "Document", text: "Record the process, the results, the failures and the lessons." },
  { name: "Grow", text: "Experience becomes knowledge for members and the next leadership." },
] as const;

/** Module index on the homepage. Order follows spec.md §8.11. */
export const modules = [
  { name: "People", href: "/people", text: "Who is in NCD, what they work on and what they want to learn." },
  { name: "Projects", href: "/projects", text: "Case studies from Project Lab: problem, research, solution, outcome." },
  { name: "Competitions", href: "/competitions", text: "Competition Radar and Competition Briefs, not a wall of posters." },
  { name: "Activities", href: "/activities", text: "A dated record of what NCD did and what came out of it." },
  { name: "Knowledge", href: "/knowledge", text: "Lessons, tutorials and post-mortems that outlast a semester." },
] as const;

/** Per-module empty states (design.md §23). */
export const emptyStates = {
  people: { title: "No members listed yet.", description: "Members who choose to be listed will appear here." },
  projects: { title: "No projects yet.", description: "Projects created by NCD will appear here." },
  competitions: { title: "No competitions on the Radar yet.", description: "Competitions NCD is tracking will appear here, each with a brief." },
  activities: { title: "No activities recorded yet.", description: "NCD activities and what came out of them will appear here." },
  knowledge: { title: "No articles yet.", description: "Lessons, tutorials and post-mortems will appear here." },
  transparency: { title: "Nothing published yet.", description: "Information NCD chooses to make public will appear here." },
  archive: { title: "No periods archived yet.", description: "Each closed period will keep its people, activities, projects and knowledge here." },
} as const;
