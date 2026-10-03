/**
 * Database types generated from Supabase schema.
 * Update after running migrations.
 */

export type UserRole = "member" | "admin" | "treasurer";

export interface Profile {
  id: string; // matches auth.users.id
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Member extends Profile {
  // Extended member info for directory
  email: string;
  cohort: string | null;
  major: string | null;
  skills: string[] | null;
  interests: string[] | null;
  learning_targets: string[] | null;
  is_public: boolean;
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