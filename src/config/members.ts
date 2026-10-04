/**
 * Columns the UI may read from `members`. Explicit on purpose:
 * `npm` (student ID) and the placeholder `email` stay in the database and never reach the browser.
 */
export const MEMBER_COLUMNS =
  "id, full_name, avatar_url, org_role, division, team, is_public, interests, skills, learning_targets, cohort, major, created_at, updated_at";
