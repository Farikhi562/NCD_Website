"use client";

import { Box, Hand, Trophy, Wifi } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/auth";
import { useMembers } from "@/hooks/useMembers";
import { UGP_COMPETITION, ugpTeams } from "@/config/ugp";

const teamIcons = { "Team 1": Box, "Team 2": Wifi, "Team 3": Hand } as const;

export default function WorkspaceCompetitionsPage() {
  const { profile } = useAuth();
  const { members, loading, error } = useMembers();

  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Competitions" description="Your competition workspace: the teams, their products and who is on them." />

      <section aria-labelledby="ugp-heading" className="mt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="ugp-heading" className="type-h3 font-medium">{UGP_COMPETITION.name}</h2>
            <p className="type-small mt-1 text-text-secondary">{UGP_COMPETITION.fullName}</p>
          </div>
          <Badge tone="success">Active</Badge>
        </div>

        {error ? (
          <EmptyState icon={Trophy} title="Couldn't load teams" description="Something went wrong while loading team rosters. Refresh to try again." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {ugpTeams.map((team) => {
              const Icon = teamIcons[team.name];
              const roster = members.filter((m) => m.team === team.name);
              const mine = profile?.team === team.name;
              return (
                <Card key={team.name} className={mine ? "border-ncd-electric/60" : undefined}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <div>
                        <h3 className="type-h4 font-medium">{team.name}</h3>
                        <p className="type-caption text-text-muted">{team.field}</p>
                      </div>
                    </div>
                    {mine && <Badge tone="info">Your team</Badge>}
                  </div>

                  <div className="mt-4 rounded-lg border border-border bg-ncd-surface/50 p-4">
                    <p className="type-caption text-text-muted">Product / Idea</p>
                    <p className="type-body mt-1 font-medium">{team.product}</p>
                  </div>

                  <p className="type-caption mt-5 text-text-muted">{loading ? "Members" : `Members (${roster.length})`}</p>
                  {loading ? (
                    <div className="skeleton mt-2 h-24 w-full" aria-busy="true" />
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {roster.map((m) => (
                        <li key={m.id} className="flex items-center gap-3">
                          <Avatar name={m.full_name ?? "Member"} src={m.avatar_url} size={32} />
                          <span className="type-small min-w-0 truncate">{m.full_name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <p className="type-small mt-6 text-text-muted">No results, rankings or scores have been recorded for UGP-GBIC.</p>
      </section>
    </Container>
  );
}
