/**
 * Membership application constants and copy (spec D-05, F-04).
 * Everything the UI needs to describe the join flow lives here so the copy
 * stays in one place; the capacity numbers themselves always come from the
 * database (`ncd_membership_capacity()`), never from this file.
 */
import type { MembershipApplicationStatus } from "@/lib/database.types";

/** Applicants can only state this university (enforced in the form, the API and the database). */
export const NCD_UNIVERSITY = "Universitas Gunadarma";

export const VERIFICATION_DOCUMENT_TYPES = ["KRS", "KTM"] as const;

/** Private Supabase Storage bucket for KRS/KTM (migration 004). Never a public bucket. */
export const VERIFICATION_BUCKET = "membership-verification";

export const MAX_SEMESTER = 14;

/** Deliberately short answers: this is an application, not a 40-question form. */
export const MAX_ANSWER_LENGTH = 500;

export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export const ACCEPTED_DOCUMENT_LABEL = "JPG, PNG, WebP or PDF, up to 5 MB";

/** remaining_slots = max_members - confirmed_members (spec §2, computed by the UI). */
export function remainingSlots(capacity: { max_members: number; confirmed_members: number }): number {
  return Math.max(capacity.max_members - capacity.confirmed_members, 0);
}

export function isFull(capacity: { max_members: number; confirmed_members: number }): boolean {
  return remainingSlots(capacity) === 0;
}

export type StatusCopy = {
  label: string;
  title: string;
  description: string;
  tone: "info" | "warning" | "success" | "danger" | "neutral";
};

/** Applicant-facing status copy. Internal reviewer notes are never part of this. */
export const applicationStatusCopy: Record<MembershipApplicationStatus, StatusCopy> = {
  pending: {
    label: "Pending",
    title: "Your application has been received and is waiting for review.",
    description: "An NCD administrator will look at your application and your student verification document.",
    tone: "info",
  },
  under_review: {
    label: "Under review",
    title: "Your application is currently being reviewed by the NCD team.",
    description: "No action is needed from you. We will keep your application status updated on this page.",
    tone: "warning",
  },
  approved: {
    label: "Approved",
    title: "Your application has been approved. Welcome to NCD.",
    description: "You are now an official NCD member and appear in the NCD member directory.",
    tone: "success",
  },
  rejected: {
    label: "Not accepted",
    title: "Your application was not accepted at this time.",
    description: "You can apply again later if your situation changes.",
    tone: "danger",
  },
};
