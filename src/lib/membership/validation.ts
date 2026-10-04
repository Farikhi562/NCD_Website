import { z } from "zod";
import {
  MAX_ANSWER_LENGTH,
  MAX_SEMESTER,
  NCD_UNIVERSITY,
  VERIFICATION_DOCUMENT_TYPES,
} from "@/config/membership";

/**
 * Server-side validation for POST /api/membership-applications.
 * Client validation is only a courtesy; every rule below is enforced here and
 * again by the database (check constraints + triggers, migration 004).
 */
export const applicationSchema = z.object({
  full_name: z.string().min(2, "Enter your full name.").max(120, "Full name is too long."),
  npm: z
    .string()
    .min(3, "Enter your NPM.")
    .max(20, "NPM is too long.")
    .regex(/^[A-Za-z0-9-]+$/, "NPM may only contain letters, numbers and hyphens."),
  university: z.literal(NCD_UNIVERSITY, { message: "NCD membership is for Universitas Gunadarma students only." }),
  faculty: z.string().min(2, "Enter your faculty.").max(120, "Faculty name is too long."),
  study_program: z.string().min(2, "Enter your study program.").max(120, "Study program name is too long."),
  semester: z
    .number({ message: "Select your current semester." })
    .int("Select your current semester.")
    .min(1, "Select your current semester.")
    .max(MAX_SEMESTER, `Semester must be between 1 and ${MAX_SEMESTER}.`),
  email: z
    .string()
    .min(5, "Enter your email address.")
    .max(200, "Email address is too long.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."),
  whatsapp: z
    .string()
    .min(9, "Enter a valid WhatsApp number.")
    .max(20, "WhatsApp number is too long.")
    .regex(/^\+?[0-9\s()-]+$/, "WhatsApp number may only contain digits, spaces, +, ( and )."),
  motivation: z.string().min(10, "Tell us why you want to join NCD.").max(MAX_ANSWER_LENGTH, `Keep it under ${MAX_ANSWER_LENGTH} characters.`),
  skills: z.string().min(10, "Tell us your strongest skills or interests.").max(MAX_ANSWER_LENGTH, `Keep it under ${MAX_ANSWER_LENGTH} characters.`),
  contribution: z.string().min(10, "Tell us what you would like to contribute.").max(MAX_ANSWER_LENGTH, `Keep it under ${MAX_ANSWER_LENGTH} characters.`),
  document_type: z.enum(VERIFICATION_DOCUMENT_TYPES, { message: "Select KRS or KTM." }),
  document_path: z.string().min(8, "Upload your student verification document.").max(400, "Document reference is too long."),
  consent: z.literal(true, { message: "You must confirm that the information and document belong to you." }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export interface FieldError {
  field: string;
  message: string;
}

/** Zod issues -> flat field errors the form can render inline. */
export function toFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: String(issue.path[0] ?? "form"),
    message: issue.message,
  }));
}

/** Trim every string field before validating so whitespace-only input fails early. */
export function prepareApplicationInput(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const out: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  for (const key of [
    "full_name",
    "npm",
    "faculty",
    "study_program",
    "email",
    "whatsapp",
    "motivation",
    "skills",
    "contribution",
    "document_type",
    "document_path",
  ]) {
    const value = out[key];
    if (typeof value === "string") out[key] = value.trim();
  }
  if (typeof out.semester === "string" && out.semester !== "") out.semester = Number(out.semester);
  return out;
}
