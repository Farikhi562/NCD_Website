import type { Metadata } from "next";
import { Trophy, Box, Wifi, Hand, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { buttonVariants } from "@/components/ui/Button";
import { getMembers } from "@/lib/people";
import { UGP_COMPETITION, ugpTeams } from "@/config/ugp";
import { achievements } from "@/config/achievements";

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

      {/* Achievement — verified milestone (spec.md §8.9, D-15). Facts from config/achievements.ts. */}
      <section aria-labelledby="achievement-heading" className="mb-12">
        <div className="mb-6">
          <h2 id="achievement-heading" className="type-h3 font-medium">Achievement</h2>
          <p className="type-small mt-1 text-text-secondary">
            Milestones recorded by NCD members, shown with the source they come from.
          </p>
        </div>

        {achievements.map((achievement) => {
          const team = achievement.team.map((entry) => ({
            ...entry,
            avatarUrl: members.find((m) => m.full_name === entry.memberName)?.avatar_url ?? null,
          }));

          return (
            <Card key={achievement.id}>
              <Badge tone="neutral">{achievement.category}</Badge>

              <h3 className="type-h3 mt-4 font-medium">{achievement.title}</h3>
              <p className="type-body mt-1 text-text-secondary">{achievement.subtitle}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="type-h4 font-medium">{achievement.product.name}</p>
                <Badge tone="neutral">{achievement.product.type}</Badge>
                <Badge tone="success">Product status: {achievement.product.status}</Badge>
              </div>

              <p className="type-body mt-4 max-w-[80ch] text-text-secondary">{achievement.description}</p>

              <div className="mt-6 border-t border-border pt-6">
                <h4 className="type-small font-medium text-text-secondary">Team</h4>
                <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                  {team.map((person) => (
                    <li key={person.memberName} className="flex items-center gap-3">
                      <Avatar name={person.memberName} src={person.avatarUrl} size={40} />
                      <div className="min-w-0">
                        <p className="type-body font-medium truncate">{person.memberName}</p>
                        <p className="type-small text-text-secondary">{person.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
                <div>
                  <span className="type-label text-text-secondary">Announced</span>
                  <p className="num type-small text-text-primary">{achievement.announcedOn}</p>
                </div>
                <div>
                  <span className="type-label text-text-secondary">Source</span>
                  <p className="type-small text-text-primary">{achievement.source.publisher}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-start md:justify-between">
                <p className="type-small max-w-[64ch] text-text-secondary">
                  Recorded as the delegation, the team behind it and the product work that followed. No competition
                  result, ranking or award is claimed. NEXA Campus is a NEXA Tech Labs product, not an official
                  university system.
                </p>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a
                    className={buttonVariants({ variant: "primary" })}
                    href={achievement.product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Product
                    <ExternalLink className="size-4" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a
                    className={buttonVariants({ variant: "secondary" })}
                    href={achievement.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {achievement.source.label}
                    <ExternalLink className="size-4" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
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
