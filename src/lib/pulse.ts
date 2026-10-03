/**
 * Current Pulse (spec.md §8.11): a number appears only if it is computed from
 * the database. Phase 1 has no database, so every value is null and the UI
 * shows "Not yet documented". Replace with live queries in the data phase.
 * TODO(F-01): wire to Supabase counts (active projects, active competitions, learning sessions).
 */
export type PulseItem = { label: string; value: number | null };

export async function getPulse(): Promise<PulseItem[]> {
  return [
    { label: "Active projects", value: null },
    { label: "Active competitions", value: null },
    { label: "Learning sessions", value: null },
  ];
}
