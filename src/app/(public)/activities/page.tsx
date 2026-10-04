import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "Activities";
const description = "A dated record of what NCD did and what came out of it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/activities" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={CalendarDays} empty={emptyStates.activities} />;
}
