import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { emptyStates } from "@/config/content";

const title = "Projects";
const description = "Case studies from Project Lab: what the problem was, what got built, what happened.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={FolderKanban} empty={emptyStates.projects} />;
}
