/**
 * Verified achievements recorded on the NCD website.
 *
 * Why config and not the database: there is no `achievements` table in the
 * schema (spec.md §10 entity list) and "what counts as an achievement" is still
 * open (spec.md D-15). Organization facts that do not live in the database are
 * held here — the same way `config/ugp.ts` holds the UGP-GBIC teams.
 *
 * Hard rules (agents.md §8, spec.md §8.9):
 * - Every field must be traceable to a named source. No rankings, medals,
 *   finalists, judging results, revenue, user counts or other metrics.
 * - Team members are referenced by canonical `members.full_name` and resolved
 *   against the database at render time. Never duplicate people or avatars.
 * - `role` is the person's role *inside this achievement's team only* — never
 *   an NCD organizational role (division, Chairperson, …).
 */

export type AchievementTeamMember = {
  /** Must match `members.full_name` exactly; resolved to the canonical member record at render time. */
  memberName: string;
  /** Role inside this achievement's team only. */
  role: string;
};

export type Achievement = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  /** Date the external source published the record, written out in full. */
  announcedOn: string;
  product: { name: string; type: string; status: string; url: string };
  team: AchievementTeamMember[];
  source: { label: string; publisher: string; url: string };
};

export const achievements: readonly Achievement[] = [
  {
    id: "gemastik-2026-delegation",
    title: "GEMASTIK 2026",
    subtitle: "Universitas Gunadarma Delegation",
    category: "Competition / Product Development",
    description:
      "A student-built SaaS product developed by the team as part of their technology and business development work, focused on helping students organize and manage academic deadlines and reminders.",
    announcedOn: "10 August 2026",
    product: {
      name: "NEXA Campus Ecosystem",
      type: "SaaS",
      status: "Live",
      url: "https://campus.nexatechlabs.my.id/",
    },
    team: [
      { memberName: "Muhamad Fauzan Al Farikhi", role: "Team Leader" },
      { memberName: "Mirza Danisywar Noor Wahyu", role: "Team member" },
      { memberName: "Rangga Dwi Prasetyo", role: "Team member" },
    ],
    source: {
      label: "Official announcement",
      publisher: "Bidang Kemahasiswaan Universitas Gunadarma",
      url: "https://kemahasiswaan.gunadarma.ac.id/pengumuman-penetapan-delegasi-universitas-gunadarma-pada-gemastik-tahun-2026-hasil-seleksi-internal-gelombang-iii",
    },
  },
];
