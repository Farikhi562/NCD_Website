import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Activities",
  description: "NCD activities record.",
};

export default function ActivitiesPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Activities", href: "/app/activities" }
      ]} />
      <PageHeader title="Activities" description="A dated record of what NCD did and what came out of it." className="mt-8" />
      <ModulePage title="Activities" description={emptyStates.activities.description} icon={Calendar} empty={emptyStates.activities} className="mt-8" />
    </Container>
  );
}