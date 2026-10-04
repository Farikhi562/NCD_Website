import type { Metadata } from "next";
import { Trophy, Box, Wifi, Hand } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getMembers } from "@/lib/people";
import { UGP_COMPETITION, ugpTeams } from "@/config/ugp";

export const metadata: Metadata = {
  title: "Competitions",
  description: "NCD Competition Radar and Briefs.",
  alternates: { canonical: "/competitions" },
};

const teamIcons = { "Team 1": Box, "Team 2": Wifi, "Team 3": Hand } as const;

export default async function CompetitionsPage() {
  // Rosters come from the members table, so this page can never disagree with People.
  const members = await getMembers();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Competitions", href: "/competitions" }
      ]} />
      <PageHeader
        title="Competitions"
        description="Competition Radar and Competition Briefs for what NCD is tracking."
        className="mb-8"
      />

      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="type-h2 font-medium">{UGP_COMPETITION.name}</h2>
            <p className="type-body mt-1 text-text-secondary">{UGP_COMPETITION.fullName}</p>
          </div>
          <Badge tone="success">Active</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ugpTeams.map((team) => {
            const Icon = teamIcons[team.name];
            const roster = members.filter((m) => m.team === team.name);
            return (
              <Card key={team.name} className="h-full p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <div>
                    <h3 className="type-h4 font-medium">{team.name}</h3>
                    <p className="type-caption text-text-muted">{team.field}</p>
                  </div>
                </div>

                <dl>
                  <div className="mb-4 rounded-lg border border-border bg-ncd-surface/50 p-4">
                    <dt className="type-caption mb-1 text-text-muted">Product / Idea</dt>
                    <dd className="type-h4 font-medium text-text-primary">{team.product}</dd>
                  </div>
                  <div className="space-y-2">
                    <dt className="type-caption text-text-muted">Members</dt>
                    <dd>
                      <ul className="space-y-1">
                        {roster.map((m) => (
                          <li key={m.id} className="type-small flex items-center gap-2 text-text-secondary">
                            <span className="size-1.5 rounded-full bg-border" aria-hidden />
                            {m.full_name}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="rounded-lg border border-dashed border-border-strong bg-ncd-dark p-8 text-center md:p-12">
        <Trophy className="mx-auto mb-4 size-6 text-text-muted" aria-hidden />
        <p className="type-h4 mb-2 text-text-primary">Competition Radar</p>
        <p className="type-body mx-auto max-w-[60ch] text-text-secondary">
          More competitions tracked by NCD will appear here. Each entry includes a Competition Brief with problem analysis, requirements, eligibility, and readiness assessment.
        </p>
      </div>
    </Container>
  );
}
