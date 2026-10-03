import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Documentation",
  description: "NCD internal documentation and templates.",
};

export default function DocumentationPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Documentation", href: "/app/documentation" }
      ]} />
      <PageHeader title="Documentation" description="Internal documentation, templates, and references." className="mt-8" />
      <ModulePage title="Documentation" description="No documentation added yet." icon={FileText} empty={{ title: "No documents yet", description: "Internal docs will appear here." }} className="mt-8" />
    </Container>
  );
}