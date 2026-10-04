import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Documentation",
  description: "NCD internal documentation.",
};

const categories = [
  { name: "Meeting notes", text: "Notes and follow-ups from NCD meetings." },
  { name: "Project documentation", text: "Records of what each project did and learned." },
  { name: "Competition documentation", text: "Briefs, submissions and retrospectives." },
  { name: "Organization documents", text: "Structure, work program, vision and mission." },
  { name: "Decision records", text: "What was decided, by whom and why." },
];

export default function WorkspaceDocumentationPage() {
  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Documentation" description="NCD's internal record: what happened, what was decided, and why." />
      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.name}>
            <Card className="h-full border-dashed">
              <h2 className="type-h4 font-medium">{c.name}</h2>
              <p className="type-small mt-2 text-text-secondary">{c.text}</p>
              <p className="type-caption mt-4 text-text-muted">No documents yet</p>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
