"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/database.types";

/** Projects from the database (RLS: signed-in members can read). Empty array means "none yet", never fake rows. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, description, status, start_date, end_date, created_at, updated_at")
          .order("updated_at", { ascending: false });
        if (cancelled) return;
        if (error) setError(error.message);
        else setProjects((data as unknown as Project[]) ?? []);
      } catch {
        if (!cancelled) setError("Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}
