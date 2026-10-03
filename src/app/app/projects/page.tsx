import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "NCD Project Lab case studies.",
};

export default function ProjectsPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Projects", href: "/app/projects" }
      ]} />
      <PageHeader title="Projects" description="Case studies from Project Lab: problem, research, solution, outcome." className="mt-8" />
      <ModulePage title="Projects" description={emptyStates.projects.description} icon={FolderKanban} empty={emptyStates.projects} className="mt-8" />
    </Container>
  );
}