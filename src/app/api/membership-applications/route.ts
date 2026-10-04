import { NextResponse, type NextRequest } from "next/server";
import type { MembershipApplication, MembershipCapacity } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { VERIFICATION_BUCKET } from "@/config/membership";
import { deliverPendingNotifications } from "@/lib/email/outbox";
import {
  applicationSchema,
  prepareApplicationInput,
  toFieldErrors,
  type FieldError,
} from "@/lib/membership/validation";

/**
 * POST /api/membership-applications — applicant submission.
 *
 * Server-side validation (agents.md §7): session required, zod schema, the
 * university literal, capacity, and the document path. The database enforces
 * the same rules again (unique open application, capacity trigger, document
 * folder trigger), so none of this can be bypassed by calling PostgREST
 * directly.
 */

const SELECT_COLUMNS =
  "id, user_id, full_name, npm, university, faculty, study_program, semester, email, whatsapp, motivation, skills, contribution, document_type, document_path, status, submitted_at, reviewed_at, member_id, created_at";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json(401, { error: "You must be signed in to submit an application." });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  const parsed = applicationSchema.safeParse(prepareApplicationInput(raw));
  if (!parsed.success) {
    const fieldErrors: FieldError[] = toFieldErrors(parsed.error);
    return json(400, { error: "Please fix the highlighted fields.", fieldErrors });
  }

  const input = parsed.data;

  // Capacity first: the public page and this endpoint agree on the same numbers.
  const { data: capacityData, error: capacityError } = await supabase.rpc("ncd_membership_capacity");
  if (capacityError) {
    console.error("Capacity lookup failed:", capacityError.message);
    return json(500, { error: "Could not verify membership capacity. Please try again." });
  }

  const capacity = capacityData as unknown as MembershipCapacity;
  if (capacity.confirmed_members >= capacity.max_members) {
    return json(409, {
      code: "MEMBERSHIP_FULL",
      error: "Membership is currently full.",
      capacity,
    });
  }

  // The document must exist, in the applicant's own folder, before we record
  // the application — otherwise an admin could review a missing file.
  if (!input.document_path.startsWith(`${user.id}/`)) {
    return json(400, { error: "The verification document must be uploaded before submitting." });
  }

  const fileName = input.document_path.slice(user.id.length + 1);
  const { data: folder, error: listError } = await supabase.storage.from(VERIFICATION_BUCKET).list(user.id);

  if (listError || !folder?.some((entry) => entry.name === fileName)) {
    console.error("Verification document lookup failed:", listError?.message ?? "file not found");
    return json(400, {
      error: "Your student verification document could not be found. Upload it again and resubmit.",
    });
  }

  const { data: application, error: insertError } = await supabase
    .from("membership_applications")
    .insert({
      user_id: user.id,
      full_name: input.full_name,
      npm: input.npm,
      university: input.university,
      faculty: input.faculty,
      study_program: input.study_program,
      semester: input.semester,
      email: input.email,
      whatsapp: input.whatsapp,
      motivation: input.motivation,
      skills: input.skills,
      contribution: input.contribution,
      document_type: input.document_type,
      document_path: input.document_path,
      status: "pending",
    })
    .select(SELECT_COLUMNS)
    .single();

  if (insertError) {
    // Unique violation: an application is already open for this user or NPM.
    if (insertError.code === "23505") {
      const existing = await loadExistingApplication(supabase, user.id);
      return json(409, {
        code: "DUPLICATE_APPLICATION",
        error: existing
          ? "You already have an application on file. Your current status is shown below instead of creating a new one."
          : "An application with this NPM is already on file. Only one open application per NPM is accepted.",
        application: existing,
        capacity,
      });
    }

    // Raised by the database when the club is full or the applicant already is
    // a member — mapped to a clear HTTP status instead of a raw SQL error.
    if (insertError.code === "P0001" || insertError.code === "P0004") {
      const message = insertError.message || "This application cannot be submitted.";
      const full = message.toLowerCase().includes("full") || message.toLowerCase().includes("capacity");
      return json(full ? 409 : 400, {
        code: full ? "MEMBERSHIP_FULL" : "APPLICATION_REJECTED",
        error: full ? "Membership is currently full." : message,
        capacity,
      });
    }

    console.error("Application insert failed:", insertError.message);
    return json(500, { error: "Could not save your application. Please try again." });
  }

  // The application is already recorded at this point. Notification delivery is
  // best effort and never turns a successful submission into an error.
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    await deliverPendingNotifications(siteUrl);
  } catch (err) {
    console.error("Notification delivery skipped:", err instanceof Error ? err.message : err);
  }

  return json(201, {
    application: application as unknown as MembershipApplication,
    capacity,
  });
}

async function loadExistingApplication(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("membership_applications")
    .select(SELECT_COLUMNS)
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as unknown as MembershipApplication | null) ?? null;
}

export async function GET() {
  return json(405, { error: "Use POST to submit an application." });
}
