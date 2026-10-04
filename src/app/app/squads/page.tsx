import type { Metadata } from "next";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Squads",
  description: "Temporary working groups formed around a competition or project.",
};

const concepts = [
  { name: "Division", text: "Permanent function of NCD (People & Culture, Competition & Strategy, Project & Development)." },
  { name: "Competition team", text: "A UGP-GBIC team: Team 1, Team 2 or Team 3." },
  { name: "Squad", text: "A temporary group formed around a competition or project. Members can come from any division." },
];

export default function WorkspaceSquadsPage() {
  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Squads" description="Temporary working groups formed around a competition or project." />
      <div className="mt-8 space-y-8">
        <EmptyState
          icon={Users}
          title="No squads yet"
          description="Squads will appear here with their members, objective, current focus and linked project once they are formed."
        />
        <section aria-labelledby="concepts-heading">
          <h2 id="concepts-heading" className="type-h4 mb-4 font-medium">Division, competition team and squad are different things</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {concepts.map((c) => (
              <Card key={c.name}>
                <p className="type-body font-medium">{c.name}</p>
                <p className="type-small mt-2 text-text-secondary">{c.text}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
