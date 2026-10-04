"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { Users } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import type { Member } from "@/lib/database.types";
import { ugpTeamByName } from "@/config/ugp";

const UNSET = "Not Assigned";

function TagList({ label, items }: { label: string; items: string[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <dt className="type-caption text-text-muted">{label}</dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <Badge key={item}>{item}</Badge>)}
      </dd>
    </div>
  );
}

function MemberDetail({ member }: { member: Member }) {
  const name = member.full_name ?? "Unnamed member";
  const team = ugpTeamByName(member.team);
  const hasTags = [member.interests, member.skills, member.learning_targets].some((t) => t && t.length > 0);
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={name} src={member.avatar_url} size={64} />
        <div className="min-w-0">
          <p className="type-h4 font-medium">{name}</p>
          <p className="type-small text-text-secondary">{member.org_role ?? "Member"}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="type-caption text-text-muted">Division</dt>
          <dd className="type-small mt-1">{member.division ?? UNSET}</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Team</dt>
          <dd className="type-small mt-1">{member.team ?? UNSET}</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Competition involvement</dt>
          <dd className="type-small mt-1">
            {team ? `UGP-GBIC · ${team.name} · ${team.product}` : "Not in a UGP-GBIC team"}
          </dd>
        </div>
        <TagList label="Interests" items={member.interests} />
        <TagList label="Skills" items={member.skills} />
        <TagList label="Learning targets" items={member.learning_targets} />
      </dl>
      {!hasTags && <p className="type-small mt-6 text-text-muted">No interests or skills added yet.</p>}
    </div>
  );
}

export default function WorkspacePeoplePage() {
  const { members, loading, error } = useMembers();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [division, setDivision] = useState("all");
  const [selected, setSelected] = useState<Member | null>(null);

  // Filter options come from the data itself, so they can never drift from the database.
  const teams = useMemo(() => [...new Set(members.map((m) => m.team ?? UNSET))].sort(), [members]);
  const divisions = useMemo(() => [...new Set(members.map((m) => m.division ?? UNSET))].sort(), [members]);

  const filtered = members.filter((m) => {
    const matchesQuery = (m.full_name ?? "").toLowerCase().includes(query.trim().toLowerCase());
    const matchesTeam = team === "all" || (m.team ?? UNSET) === team;
    const matchesDivision = division === "all" || (m.division ?? UNSET) === division;
    return matchesQuery && matchesTeam && matchesDivision;
  });

  return (
    <Container className="py-8 md:py-12">
      <PageHeader
        title="People"
        description="Your NCD member workspace: find teammates, see who works on what."
      />

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4"><div className="skeleton h-12 w-full" /></Card>
          ))}
        </div>
      ) : error ? (
        <EmptyState className="mt-8" icon={Users} title="Couldn't load members" description="Something went wrong while loading the member list. Refresh to try again." />
      ) : members.length === 0 ? (
        <EmptyState className="mt-8" icon={Users} title="No members listed yet" description="Members will appear here once they are added to the directory." />
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_200px_240px]">
            <SearchInput id="people-search" label="Search members by name" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select id="people-team" label="Team" value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="all">All teams</option>
              {teams.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select id="people-division" label="Division" value={division} onChange={(e) => setDivision(e.target.value)}>
              <option value="all">All divisions</option>
              {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>

          <p className="type-small mt-6 text-text-secondary" aria-live="polite">
            {filtered.length} of {members.length} members
          </p>

          {filtered.length === 0 ? (
            <EmptyState className="mt-4" icon={Users} title="No members match" description="Try a different name or clear a filter." />
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => {
                const name = m.full_name ?? "Unnamed member";
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(m)}
                      className="block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-ncd-electric"
                    >
                      <Card className="flex items-center gap-3 p-4 transition-colors hover:border-ncd-electric/50 hover:bg-ncd-hover">
                        <Avatar name={name} src={m.avatar_url} size={40} />
                        <span className="min-w-0 flex-1">
                          <span className="type-body block truncate font-medium">{name}</span>
                          <span className="type-caption block truncate text-text-muted">
                            {m.org_role ?? "Member"} · {m.team ?? UNSET}
                          </span>
                        </span>
                      </Card>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <Sheet open={!!selected} onClose={() => setSelected(null)} title="Member">
        {selected && <MemberDetail member={selected} />}
      </Sheet>
    </Container>
  );
}
