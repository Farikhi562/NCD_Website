import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Member } from "@/lib/database.types";

export async function getMembers(): Promise<Member[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("is_public", true)
    .order("team", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }

  return (data as Member[]) || [];
}

export async function getLeadership(): Promise<Member[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .in("org_role", ["Chairperson — Period I", "Vice Chairperson — Period I"])
    .order("org_role", { ascending: false });

  if (error) {
    console.error("Error fetching leadership:", error);
    return [];
  }

  return (data as Member[]) || [];
}

export async function getMembersByTeam(team: string): Promise<Member[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("team", team)
    .eq("is_public", true)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return (data as Member[]) || [];
}

export async function getDivisions(): Promise<{
  name: string;
  description: string;
  programs: string[];
  lead: string | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[]> {
  const { Users, Award, Building2 } = await import("lucide-react");
  
  return [
    {
      name: "People & Culture",
      description: "Manages member development, onboarding, networking, and personal growth.",
      programs: ["NCD Discover", "NCD Connect", "NCD Grow", "Growth Map"],
      lead: null, // Will be fetched from members table
      icon: Users,
      color: "bg-ncd-electric/20 text-ncd-electric",
    },
    {
      name: "Competition & Strategy",
      description: "Manages Competition Radar, Competition Brief, Competition Day, and Retrospective.",
      programs: ["Competition Radar", "Competition Brief", "Competition Day", "Retrospective"],
      lead: null,
      icon: Award,
      color: "bg-success/20 text-success",
    },
    {
      name: "Project & Development",
      description: "Manages Project Lab, Project Clinic, Squad formation, and Demo Day.",
      programs: ["Project Lab", "Project Clinic", "Squad Formation", "Demo Day"],
      lead: null,
      icon: Building2,
      color: "bg-warning/20 text-warning",
    },
  ];
}

export async function getDivisionLeads(): Promise<Record<string, string | null>> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("members")
    .select("division, full_name")
    .eq("org_role", "Division Lead");

  if (error) {
    console.error("Error fetching division leads:", error);
    return {};
  }

  const leads: Record<string, string | null> = {};
  (data as { division: string; full_name: string }[] || []).forEach((member) => {
    leads[member.division] = member.full_name;
  });

  return leads;
}