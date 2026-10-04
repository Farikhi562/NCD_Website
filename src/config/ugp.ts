/**
 * UGP-GBIC structure. Team names + product ideas are organization facts that
 * do not live in the database (members.team only stores "Team 1/2/3").
 * Rosters and counts are NEVER written here: they come from the members table.
 * Only 3 teams exist. Do not add a Team 4.
 */
export const UGP_COMPETITION = {
  id: "ugp-gbic",
  name: "UGP-GBIC",
  fullName: "Universitas Gunadarma Programming - Global Business Innovation Challenge",
} as const;

export type UgpTeam = { name: "Team 1" | "Team 2" | "Team 3"; product: string; field: string };

export const ugpTeams: readonly UgpTeam[] = [
  { name: "Team 1", product: "SCALE", field: "Technology / Digital Business" },
  { name: "Team 2", product: "NFC WiFi", field: "Technology / Digital Business" },
  { name: "Team 3", product: "CASSAFEX", field: "Manufacturing / Craft" },
];

export function isCompetitionTeam(team: string | null | undefined): boolean {
  return !!team && ugpTeams.some((t) => t.name === team);
}

export function ugpTeamByName(team: string | null | undefined): UgpTeam | undefined {
  return ugpTeams.find((t) => t.name === team);
}
