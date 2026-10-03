import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Growth",
  description: "NCD personal and organizational growth tracking.",
};

export default function GrowthPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Growth", href: "/app/growth" }
      ]} />
      <PageHeader title="Growth" description="Track personal and organizational growth over time." className="mt-8" />
      <ModulePage title="Growth" description="Growth tracking features coming soon." icon={TrendingUp} empty={{ title: "No growth data yet", description: "Growth metrics will appear here." }} className="mt-8" />
    </Container>
  );
}