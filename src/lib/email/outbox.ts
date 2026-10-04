/**
 * Notification outbox for NCD membership applications (server-only).
 *
 * Every submission is recorded by a database trigger in `public.email_outbox`
 * inside the same transaction as the application itself, so a notification is
 * never lost even when no email provider is configured.
 *
 * This module is the delivery half: it sends pending messages when a provider
 * key is present, and leaves them `pending` (with an explanatory error) when it
 * is not. No API key is ever read in the browser.
 *
 * DECISION NEEDED(D-26): the project has no email provider yet. `RESEND_API_KEY`
 * is the optional transport and `EMAIL_FROM` the verified sender address; any
 * other provider can replace the delivery call without touching the outbox.
 */
import type { EmailOutboxMessage, MembershipApplication } from "@/lib/database.types";
import { createAdminClient } from "@/lib/supabase/admin";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function notificationRecipient(): string {
  return "nexatechlabs271@gmail.com";
}

/** Absolute admin link, so the reviewer can jump straight to the queue. */
export function reviewUrl(applicationId: string, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/app/membership-applications?application=${encodeURIComponent(applicationId)}`;
}

export function composeApplicationNotification(
  application: MembershipApplication,
  siteUrl: string,
): { subject: string; text: string } {
  const submitted = new Date(application.submitted_at).toISOString().replace("T", " ").slice(0, 19);

  const text = [
    "A new NCD membership application was submitted.",
    "",
    `Name: ${application.full_name}`,
    `NPM: ${application.npm}`,
    `University: ${application.university}`,
    `Faculty: ${application.faculty}`,
    `Study program: ${application.study_program}`,
    `Current semester: ${application.semester}`,
    `Email: ${application.email}`,
    `WhatsApp: ${application.whatsapp}`,
    `Verification document: ${application.document_type}`,
    `Submitted at: ${submitted} UTC`,
    "",
    `Review it here: ${reviewUrl(application.id, siteUrl)}`,
    "",
    "NCD Website",
  ].join("\n");

  return { subject: "New NCD Membership Application", text };
}

interface DeliverResult {
  provider: "resend" | null;
  sent: number;
  failed: number;
  pending: number;
}

/**
 * Send every pending notification. Safe to call after each submission: rows
 * already `sent` are skipped, failures stay recorded with their error.
 */
export async function deliverPendingNotifications(siteUrl: string): Promise<DeliverResult> {
  const admin = createAdminClient();
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = notificationRecipient();

  const { data, error } = await admin
    .from("email_outbox")
    .select("id, recipient, subject, kind, related_application_id, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Could not read email outbox:", error.message);
    return { provider: null, sent: 0, failed: 0, pending: 0 };
  }

  const rows = (data ?? []) as EmailOutboxMessage[];
  if (rows.length === 0) {
    return { provider: apiKey ? "resend" : null, sent: 0, failed: 0, pending: 0 };
  }

  if (!apiKey) {
    // No provider configured: the application is still fully recorded, and the
    // notification stays queued for the server-side integration to pick up.
    return { provider: null, sent: 0, failed: 0, pending: rows.length };
  }

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const applicationId = row.related_application_id;
    if (!applicationId) {
      await markOutbox(admin, row.id, "failed", "No related application.");
      failed += 1;
      continue;
    }

    const { data: application, error: appError } = await admin
      .from("membership_applications")
      .select(
        "id, full_name, npm, university, faculty, study_program, semester, email, whatsapp, document_type, submitted_at",
      )
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      await markOutbox(admin, row.id, "failed", appError?.message ?? "Application not found.");
      failed += 1;
      continue;
    }

    const { subject, text } = composeApplicationNotification(
      application as unknown as MembershipApplication,
      siteUrl,
    );

    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "NCD Website <onboarding@resend.dev>",
          to: [row.recipient || recipient],
          subject,
          text,
        }),
      });

      if (response.ok) {
        await markOutbox(admin, row.id, "sent", null);
        sent += 1;
      } else {
        const detail = await response.text();
        await markOutbox(admin, row.id, "failed", `HTTP ${response.status}: ${detail.slice(0, 300)}`);
        failed += 1;
      }
    } catch (err) {
      await markOutbox(admin, row.id, "failed", err instanceof Error ? err.message : "Send failed.");
      failed += 1;
    }
  }

  return { provider: "resend", sent, failed, pending: failed };
}

async function markOutbox(
  admin: ReturnType<typeof createAdminClient>,
  id: string,
  status: "sent" | "failed",
  lastError: string | null,
): Promise<void> {
  const { error } = await admin
    .from("email_outbox")
    .update({
      status,
      last_error: lastError,
      sent_at: status === "sent" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) console.error("Could not update email outbox row:", error.message);
}
