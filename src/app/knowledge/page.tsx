import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "Knowledge";
const description = "Lessons, tutorials and post-mortems that stay after the semester ends.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/knowledge" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={BookOpen} empty={emptyStates.knowledge} />;
}
