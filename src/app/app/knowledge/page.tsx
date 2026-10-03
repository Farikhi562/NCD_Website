import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Knowledge",
  description: "NCD knowledge base — lessons, tutorials, post-mortems.",
};

export default function KnowledgePage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Knowledge", href: "/app/knowledge" }
      ]} />
      <PageHeader title="Knowledge" description="Lessons, tutorials and post-mortems that outlast a semester." className="mt-8" />
      <ModulePage title="Knowledge" description={emptyStates.knowledge.description} icon={BookOpen} empty={emptyStates.knowledge} className="mt-8" />
    </Container>
  );
}