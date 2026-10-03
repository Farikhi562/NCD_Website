import type { Metadata } from "next";
import { Archive } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "Archive";
const description = "Each period's people, activities, projects and knowledge, kept for the next one.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/archive" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={Archive} empty={emptyStates.archive} />;
}
