import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { MembershipCapacity } from "@/lib/database.types";

/**
 * Live membership capacity from the database (never hardcoded).
 * `remaining_slots = max_members - confirmed_members` is calculated by the
 * caller — see `remainingSlots()` in `src/config/membership.ts`.
 */
export async function getMembershipCapacity(): Promise<MembershipCapacity | null> {
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
    },
  );

  const { data, error } = await supabase.rpc("ncd_membership_capacity");

  if (error) {
    console.error("Error fetching membership capacity:", error);
    return null;
  }

  const capacity = data as unknown as MembershipCapacity | null;
  if (!capacity || typeof capacity.max_members !== "number") return null;

  return {
    max_members: capacity.max_members,
    confirmed_members: capacity.confirmed_members,
  };
}
