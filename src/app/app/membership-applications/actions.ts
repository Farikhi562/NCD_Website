"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { VERIFICATION_BUCKET } from "@/config/membership";

/**
 * Admin review actions for membership applications.
 *
 * Authorization is checked twice (agents.md §6.2): here in server code, and in
 * the database — every status change goes through a SECURITY DEFINER function
 * that re-checks `profiles.role = 'admin'` before touching anything.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "You must be signed in to review applications." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Only NCD administrators can review membership applications." };
  }

  return { ok: true };
}

async function runReviewAction(
  applicationId: string,
  fn: (
    supabase: Awaited<ReturnType<typeof createClient>>,
    id: string,
    note: string | null,
  ) => PromiseLike<{ error: { message: string } | null }>,
  note: string | null = null,
): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };

  const supabase = await createClient();
  const { error } = await fn(supabase, applicationId, note);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/app/membership-applications");
  return { ok: true };
}

export async function approveApplication(applicationId: string, note?: string): Promise<ActionResult> {
  return runReviewAction(applicationId, (supabase, id, reviewNote) =>
    supabase.rpc("approve_membership_application", {
      p_application_id: id,
      p_review_note: reviewNote,
    }),
    note ?? null,
  );
}

export async function rejectApplication(applicationId: string, note?: string): Promise<ActionResult> {
  return runReviewAction(applicationId, (supabase, id, reviewNote) =>
    supabase.rpc("reject_membership_application", {
      p_application_id: id,
      p_review_note: reviewNote,
    }),
    note ?? null,
  );
}

export async function markUnderReview(applicationId: string): Promise<ActionResult> {
  return runReviewAction(applicationId, (supabase, id) =>
    supabase.rpc("set_application_under_review", { p_application_id: id }),
  );
}

/**
 * Short-lived signed URL for the KRS/KTM behind an application. The storage
 * bucket is private, so this is the only way a document is ever opened — and
 * it requires an admin session here plus the admin storage policy in the DB.
 */
export async function getDocumentUrl(
  applicationId: string,
  documentPath: string,
): Promise<ActionResult & { url?: string }> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };

  if (!documentPath.includes("/")) return { ok: false, error: "This application has no stored document." };

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(VERIFICATION_BUCKET).createSignedUrl(documentPath, 300);

  if (error || !data?.signedUrl) {
    return { ok: false, error: error?.message ?? "The document could not be opened." };
  }

  return { ok: true, url: data.signedUrl };
}
