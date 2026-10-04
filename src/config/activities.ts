/**
 * Activities that are confirmed facts (date, place, agenda).
 * No attendance, outcomes or results are stored here: none exist yet, and none may be invented.
 * Shared by the public and workspace activity pages and the dashboard.
 */
export type NcdActivity = {
  id: string;
  title: string;
  /** ISO date (local, Asia/Jakarta). */
  date: string;
  time: string;
  location: string;
  locationUrl?: string;
  category: string;
  description: string;
  audience?: string;
  agenda: readonly string[];
};

export const activities: readonly NcdActivity[] = [
  {
    id: "offline-meeting-2026-10-12",
    title: "NCD Offline Meeting",
    date: "2026-10-12",
    time: "13:30 – finish",
    location: "Bagi Kopi Margonda, Depok",
    locationUrl: "https://share.google/tFM7yQGYHS4HqlASG",
    category: "Organization",
    description:
      "Offline NCD meeting on organization structure, Period I leadership, the NCD work program, and vision and mission.",
    audience: "Period I Leadership & Division Lead candidates",
    agenda: [
      "Organization structure",
      "Period I leadership",
      "NCD work program",
      "Vision and mission",
      "Discussion and alignment",
    ],
  },
];

/** Today as YYYY-MM-DD in Asia/Jakarta, so "upcoming" does not flip at UTC midnight. */
export function todayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
}

export function splitActivities(now: Date = new Date()) {
  const today = todayISO(now);
  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
  return {
    upcoming: sorted.filter((a) => a.date >= today),
    past: sorted.filter((a) => a.date < today).reverse(),
  };
}
