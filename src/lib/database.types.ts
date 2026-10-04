/**
 * Database types generated from Supabase schema.
 * Update after running migrations.
 */

export type UserRole = "member" | "admin" | "treasurer";

// Organizational roles within NCD
export type OrgRole = 
  | "Member" 
  | "Chairperson — Period I" 
  | "Vice Chairperson — Period I" 
  | "Division Lead";

export interface Profile {
  id: string; // matches auth.users.id
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  onboarding_completed: boolean;
  npm: string | null;
  bio: string | null;
  division: string | null;
  team: string | null;
  email: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Member extends Profile {
  // Extended member info for directory
  // Nullable: approved members carry no publicly readable address (see migration 004).
  email: string | null;
  cohort: string | null;
  major: string | null;
  skills: string[] | null;
  interests: string[] | null;
  learning_targets: string[] | null;
  is_public: boolean;
  // Organizational role (separate from auth role)
  org_role: OrgRole | null;
}

/** Membership application workflow (migration 004). */
export type MembershipApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

/** The only documents NCD accepts as proof of active Universitas Gunadarma enrolment. */
export type VerificationDocumentType = "KRS" | "KTM";

export interface MembershipApplication {
  id: string;
  user_id: string;
  full_name: string;
  npm: string;
  university: string;
  faculty: string;
  study_program: string;
  semester: number;
  email: string;
  whatsapp: string;
  motivation: string;
  skills: string;
  contribution: string;
  document_type: VerificationDocumentType;
  document_path: string;
  status: MembershipApplicationStatus;
  submitted_at: string;
  reviewed_at: string | null;
  member_id: string | null;
  created_at: string;
  /** Internal — column grant keeps these server-side only. */
  reviewer_id?: string | null;
  review_note?: string | null;
}

/** Live capacity from `ncd_membership_capacity()`. remaining = max - confirmed, computed by the caller. */
export interface MembershipCapacity {
  max_members: number;
  confirmed_members: number;
}

/** Notification queued for nexatechlabs271@gmail.com; delivered server-side when a provider is configured. */
export interface EmailOutboxMessage {
  id: string;
  recipient: string;
  subject: string;
  kind: string;
  related_application_id: string | null;
  status: "pending" | "sent" | "failed";
  last_error: string | null;
  created_at: string;
  sent_at: string | null;
}

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO date
  location: string | null;
  cover_image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  problem: string | null;
  research: string | null;
  solution: string | null;
  outcome: string | null;
  status: "draft" | "active" | "completed" | "archived";
  start_date: string | null;
  end_date: string | null;
  cover_image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string | null;
  organizer: string | null;
  category: string | null;
  registration_deadline: string | null;
  competition_date: string | null;
  link: string | null;
  status: "tracking" | "registered" | "participating" | "completed" | "missed";
  brief: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt: string | null;
  cover_image: string | null;
  tags: string[] | null;
  status: "draft" | "published" | "archived";
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KasTransaction {
  id: string;
  date: string; // ISO date
  description: string;
  income: number; // integer (smallest currency unit, e.g., cents/rupiah)
  expense: number;
  balance: number; // running balance after this transaction
  category: string | null;
  reference: string | null; // receipt #, invoice #, etc.
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Row-level security context helpers
export interface RLSContext {
  userId: string;
  role: UserRole;
}