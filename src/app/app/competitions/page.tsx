import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Competitions",
  description: "NCD Competition Radar and Briefs.",
};

export default function CompetitionsPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Competitions", href: "/app/competitions" }
      ]} />
      <PageHeader title="Competitions" description="Competition Radar and Competition Briefs, not a wall of posters." className="mt-8" />
      <ModulePage title="Competitions" description={emptyStates.competitions.description} icon={Trophy} empty={emptyStates.competitions} className="mt-8" />
    </Container>
  );
}