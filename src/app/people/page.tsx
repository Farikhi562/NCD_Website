import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "People";
const description = "Who is in NCD, what they work on and what they want to learn.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/people" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={Users} empty={emptyStates.people} />;
}
