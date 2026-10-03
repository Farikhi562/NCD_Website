import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Squads",
  description: "NCD cross-functional working groups.",
};

export default function SquadsPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Squads", href: "/app/squads" }
      ]} />
      <PageHeader title="Squads" description="Cross-functional working groups for focused initiatives." className="mt-8" />
      <ModulePage title="Squads" description="No squads formed yet." icon={Users} empty={{ title: "No squads yet", description: "Squads will appear here when created." }} className="mt-8" />
    </Container>
  );
}