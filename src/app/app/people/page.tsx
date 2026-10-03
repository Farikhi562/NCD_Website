import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "People",
  description: "NCD members directory.",
};

export default function PeoplePage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "People", href: "/app/people" }
      ]} />
      <PageHeader title="People" description="NCD members, skills, interests, and learning targets." className="mt-8" />
      <ModulePage title="People" description={emptyStates.people.description} icon={Users} empty={emptyStates.people} className="mt-8" />
    </Container>
  );
}