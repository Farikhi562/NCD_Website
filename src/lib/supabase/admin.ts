import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for **server-only** code (admin server components,
 * outbox delivery). Never import this from a client component: the service
 * role key bypasses RLS and must never reach the browser.
 *
 * Uses are always paired with an explicit server-side authorization check
 * (agents.md §6.2): read the caller's role from the database first, then act.
 */
export function createAdminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() must never run in the browser.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration (SUPABASE_SERVICE_ROLE_KEY).");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
