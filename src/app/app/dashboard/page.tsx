"use client";

import Link from "next/link";
import { Calendar, Clock, FolderKanban, MapPin, Trophy, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/lib/auth";
import { useMembers } from "@/hooks/useMembers";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/lib/utils";
import { isCompetitionTeam, ugpTeamByName, ugpTeams } from "@/config/ugp";
import { splitActivities } from "@/config/activities";

function greetingFor(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(now),
  );
  return hour < 11 ? "Good morning" : hour < 15 ? "Good afternoon" : hour < 19 ? "Good evening" : "Good night";
}

function Stat({ label, value, note, loading }: { label: string; value: string | number; note?: string; loading?: boolean }) {
  return (
    <Card className="p-5">
      <p className="type-caption text-text-muted">{label}</p>
      {loading ? <div className="skeleton mt-2 h-8 w-16" /> : <p className="type-h2 mt-1 font-medium text-text-primary">{value}</p>}
      {note && !loading && <p className="type-small mt-1 text-text-secondary">{note}</p>}
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
      <dt className="type-small text-text-muted">{label}</dt>
      <dd className="type-small text-right font-medium text-text-primary">{children}</dd>
    </div>
  );
}

const quickAccess = [
  { name: "Projects", href: "/app/projects", icon: FolderKanban, text: "What NCD is building." },
  { name: "Competitions", href: "/app/competitions", icon: Trophy, text: "UGP-GBIC teams and products." },
  { name: "Activities", href: "/app/activities", icon: Calendar, text: "Upcoming and past sessions." },
  { name: "Profile", href: "/app/profile", icon: UserRound, text: "Your details and avatar." },
] as const;

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { members, loading: membersLoading, error: membersError } = useMembers();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();

  if (!user || !profile) return null;

  const now = new Date();
  const name = profile.full_name ?? user.email?.split("@")[0] ?? "Member";
  const firstName = name.split(/\s+/)[0];
  const next = splitActivities(now).upcoming[0];

  // Everything below is computed from the members table (single source of truth).
  const total = members.length;
  const participants = members.filter((m) => isCompetitionTeam(m.team)).length;
  const teamsInUse = ugpTeams.filter((t) => members.some((m) => m.team === t.name)).length;
  const myTeam = ugpTeamByName(profile.team);
  const activeProjects = projects.filter((p) => p.status === "active").length;

  return (
    <Container className="py-8 md:py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="type-caption text-text-muted">Your NCD Workspace</p>
          <h1 className="type-h1 mt-1 font-medium">{greetingFor(now)}, {firstName}.</h1>
        </div>
        <div className="flex items-center gap-3">
          {profile.role !== "member" && <Badge tone="info">{profile.role}</Badge>}
          <Avatar name={name} src={profile.avatar_url} size={40} />
        </div>
      </header>

      <section aria-labelledby="org-heading" className="mt-10">
        <h2 id="org-heading" className="type-h4 mb-4 font-medium">Organization</h2>
        {membersError ? (
          <Card className="p-5"><p className="type-small text-text-secondary">Couldn&apos;t load organization data right now.</p></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Members" value={total} loading={membersLoading} />
            <Stat label="UGP-GBIC teams" value={teamsInUse} note={`${participants} participants`} loading={membersLoading} />
            <Stat label="Not in a UGP-GBIC team" value={total - participants} loading={membersLoading} />
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="upcoming-heading" className="flex flex-col">
          <h2 id="upcoming-heading" className="type-h4 mb-4 font-medium">Upcoming</h2>
          <Card className="flex-1">
            {next ? (
              <>
                <h3 className="type-h4 font-medium">{next.title}</h3>
                <dl className="type-small mt-4 space-y-2 text-text-secondary">
                  <div className="flex items-center gap-2"><Calendar className="size-4 text-text-muted" aria-hidden /><dd>{formatDate(next.date)}</dd></div>
                  <div className="flex items-center gap-2"><Clock className="size-4 text-text-muted" aria-hidden /><dd>{next.time}</dd></div>
                  <div className="flex items-center gap-2"><MapPin className="size-4 text-text-muted" aria-hidden /><dd>{next.location}</dd></div>
                </dl>
                <ButtonLink href="/app/activities" variant="secondary" size="sm" className="mt-5">Agenda &amp; details</ButtonLink>
              </>
            ) : (
              <p className="type-small text-text-secondary">No upcoming activities recorded.</p>
            )}
          </Card>
        </section>

        <section aria-labelledby="work-heading" className="flex flex-col">
          <h2 id="work-heading" className="type-h4 mb-4 font-medium">Your work</h2>
          <Card className="flex-1">
            <dl>
              <Row label="Competition">
                {myTeam ? (
                  <span>{myTeam.name} · {myTeam.product}</span>
                ) : (
                  <span className="text-text-secondary">Not in a UGP-GBIC team</span>
                )}
              </Row>
              <Row label="Division">{profile.division && profile.division !== "Not Assigned" ? profile.division : <span className="text-text-secondary">Not assigned</span>}</Row>
              <Row label="Active projects (NCD)">
                {projectsLoading ? "…" : projectsError ? <span className="text-text-secondary">Unavailable</span> : activeProjects === 0 ? <span className="text-text-secondary">None yet</span> : activeProjects}
              </Row>
              <Row label="Recent activity"><span className="text-text-secondary">Nothing recorded yet</span></Row>
            </dl>
          </Card>
        </section>
      </div>

      <section aria-labelledby="quick-heading" className="mt-10">
        <h2 id="quick-heading" className="type-h4 mb-4 font-medium">Quick access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => (
            <Link key={item.href} href={item.href} className="group block">
              <Card className="h-full p-5 transition-colors hover:border-ncd-electric/50 hover:bg-ncd-hover">
                <item.icon className="size-5 text-ncd-electric" aria-hidden />
                <p className="type-body mt-3 font-medium text-text-primary">{item.name}</p>
                <p className="type-small mt-1 text-text-secondary">{item.text}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
