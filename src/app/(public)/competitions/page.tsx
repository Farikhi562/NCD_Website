import type { Metadata } from "next";
import { Radar } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "Competitions";
const description = "Competition Radar and Competition Briefs for what NCD is tracking.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/competitions" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={Radar} empty={emptyStates.competitions} />;
}
