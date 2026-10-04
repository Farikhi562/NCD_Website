"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Member } from "@/lib/database.types";
import { MEMBER_COLUMNS } from "@/config/members";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select(MEMBER_COLUMNS)
          .eq("is_public", true)
          .order("team", { ascending: true })
          .order("full_name", { ascending: true });

        if (error) {
          setError(error.message);
        } else {
          setMembers((data as unknown as Member[]) || []);
        }
      } catch {
        setError("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [supabase]);

  return { members, loading, error };
}

export function useLeadership() {
  const [leadership, setLeadership] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select(MEMBER_COLUMNS)
          .in("org_role", ["Chairperson — Period I", "Vice Chairperson — Period I"])
          .order("org_role", { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setLeadership((data as unknown as Member[]) || []);
        }
      } catch {
        setError("Failed to load leadership");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
  }, [supabase]);

  return { leadership, loading, error };
}

export function useDivisionLeads() {
  const [leads, setLeads] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("division, full_name")
          .eq("org_role", "Division Lead");

        if (error) {
          setError(error.message);
        } else {
          const leadMap: Record<string, string | null> = {};
          (data as { division: string; full_name: string }[] || []).forEach((member) => {
            leadMap[member.division] = member.full_name;
          });
          setLeads(leadMap);
        }
      } catch {
        setError("Failed to load division leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [supabase]);

  return { leads, loading, error };
}