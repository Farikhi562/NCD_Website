"use client";

import { Search, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useState } from "react";
import { useMembers, useLeadership, useDivisionLeads } from "@/hooks/useMembers";

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("all");
  const [filterDivision, setFilterDivision] = useState<string>("all");

  const { members, loading: membersLoading, error: membersError } = useMembers();
  const { leadership, loading: leadershipLoading, error: leadershipError } = useLeadership();
  const { leads, loading: leadsLoading } = useDivisionLeads();

  const loading = membersLoading || leadershipLoading || leadsLoading;

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = filterTeam === "all" || member.team === filterTeam;
    const matchesDivision = filterDivision === "all" || member.division === filterDivision;
    return matchesSearch && matchesTeam && matchesDivision;
  });

  if (loading) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "People", href: "/app/people" }
        ]} />
        <PageHeader title="People" description="Loading..." className="mb-8" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="skeleton h-12 w-12 mb-3" />
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </Container>
    );
  }

  if (membersError || leadershipError) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "People", href: "/app/people" }
        ]} />
        <PageHeader title="People" description="Failed to load members data." className="mt-8" />
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "People", href: "/app/people" }
      ]} />
      <PageHeader
        title="People"
        description="NCD members directory with roles, teams, divisions, and skills."
        className="mb-8"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-md border border-border bg-ncd-elevated type-small text-text-primary placeholder:text-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </div>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="hidden sm:block px-3 py-2 rounded-md border border-border bg-ncd-elevated type-small text-text-primary focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
            >
              <option value="all">All Teams</option>
              <option value="Team 1">Team 1</option>
              <option value="Team 2">Team 2</option>
              <option value="Team 3">Team 3</option>
            </select>
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="hidden sm:block px-3 py-2 rounded-md border border-border bg-ncd-elevated type-small text-text-primary focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
            >
              <option value="all">All Divisions</option>
              <option value="People & Culture">People & Culture</option>
              <option value="Competition & Strategy">Competition & Strategy</option>
              <option value="Project & Development">Project & Development</option>
              <option value="Not Assigned">Not Assigned</option>
            </select>
          </div>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p className="type-caption text-text-muted">Total Members</p>
              <p className="type-h3 font-medium text-text-primary">{members.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a4 4 0 11-6 0 4 4 0 016 0z" /></svg>
            </div>
            <div>
              <p className="type-caption text-text-muted">Leadership</p>
              <p className="type-h3 font-medium text-text-primary">{leadership.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14m10 0h2m-2 0h-2m-9 0H5a2 2 0 00-2 2v3m0 0v2a2 2 0 002 2h14a2 2 0 002-2v-3m0 0h.01M5 8h14M5 12h14m-2 4h6a2 2 0 002-2h2m-4 0a2 2 0 012-2h2" /></svg>
            </div>
            <div>
              <p className="type-caption text-text-muted">Divisions</p>
              <p className="type-h3 font-medium text-text-primary">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <div>
              <p className="type-caption text-text-muted">Support Systems</p>
              <p className="type-h3 font-medium text-text-primary">4</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leadership */}
      <section className="mb-10">
        <h2 className="type-h3 font-medium mb-6">Leadership — Period I</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {leadership.map((person) => (
            <Card key={person.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-ncd-electric/20 flex items-center justify-center text-ncd-electric type-h3 font-medium">
                  {person.avatar_url ? (
                    <img src={person.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    person.full_name?.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="type-h4 font-medium">{person.full_name}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-ncd-electric/30 bg-ncd-electric/10 text-ncd-electric type-caption font-medium">{person.role}</span>
                  </div>
                  <p className="type-body text-text-secondary mb-2">
                    {person.role === "Chairperson — Period I"
                      ? "Sets strategic direction and makes organizational decisions."
                      : "Coordinates execution, monitoring, and program delivery."}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-text-muted">Leadership</span>
                    <span className="text-border">·</span>
                    <span className="text-text-muted">Team: {person.team}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Divisions */}
      <section className="mb-10">
        <h2 className="type-h3 font-medium mb-6">Divisions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "People & Culture", description: "Manages member development, onboarding, networking, and personal growth." },
            { name: "Competition & Strategy", description: "Manages Competition Radar, Competition Brief, Competition Day, and Retrospective." },
            { name: "Project & Development", description: "Manages Project Lab, Project Clinic, Squad formation, and Demo Day." },
          ].map((division) => (
            <Card key={division.name} className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="type-h4 font-medium">{division.name}</h3>
                  <p className="type-caption text-text-muted">Lead: {leads[division.name] || "Not Assigned"}</p>
                </div>
              </div>
              <p className="type-body text-text-secondary mb-4">{division.description}</p>
              <div className="pt-4 border-t border-border">
                <p className="type-caption text-text-muted">Division Lead: {leads[division.name] || "Not Assigned"}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Members Directory */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="type-h3 font-medium">Members ({filteredMembers.length})</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-md border border-border bg-ncd-elevated type-small text-text-primary placeholder:text-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-4 hover:border-ncd-electric/50 hover:bg-ncd-hover transition-colors">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-ncd-electric/20 flex items-center justify-center text-ncd-electric type-h4 font-medium">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    member.full_name?.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="type-h4 font-medium truncate">{member.full_name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-ncd-surface/50 type-caption text-text-secondary">{member.role}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-ncd-surface/50 type-caption text-text-secondary">{member.team}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-ncd-surface/50 type-caption text-text-secondary">{member.division}</span>
                  </div>
                  <p className="type-caption text-text-muted mt-1 truncate">NPM: {member.npm || "Not set"}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="type-body text-text-secondary">No members match your search.</p>
          </div>
        )}
      </section>
    </Container>
  );
}