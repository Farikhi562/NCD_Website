"use client";

import Link from "next/link";
import { Users, FolderKanban, Trophy, BookOpen, Calendar, Wallet, Newspaper, Box, Wifi, Hand, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { members } from "@/data/members";

const appModules = [
  { name: "People", href: "/app/people", icon: Users, text: "Members, skills, interests, and learning targets." },
  { name: "Projects", href: "/app/projects", icon: FolderKanban, text: "Project Lab case studies: problem, research, solution, outcome." },
  { name: "Competitions", href: "/app/competitions", icon: Trophy, text: "Competition Radar and Briefs." },
  { name: "Activities", href: "/app/activities", icon: Calendar, text: "Dated record of NCD activities and outcomes." },
  { name: "Knowledge", href: "/app/knowledge", icon: BookOpen, text: "Lessons, tutorials, and post-mortems." },
  { name: "Transparency", href: "/app/transparency", icon: Wallet, text: "Transparent financial tracking for NCD." },
] as const;

const ugpTeams = [
  {
    name: "Team 1",
    product: "SCALE",
    field: "Technology / Digital Business",
    icon: Box,
    members: 5,
  },
  {
    name: "Team 2",
    product: "NFC WiFi",
    field: "Technology / Digital Business",
    icon: Wifi,
    members: 5,
  },
  {
    name: "Team 3",
    product: "Sarung Tangan dari Tape Singkong",
    field: "Manufacturing / Craft",
    icon: Hand,
    members: 5,
  },
];

const upcomingActivity = {
  title: "Offline NCD Meeting: Organization Structure & Period I Work Program",
  date: "2026-10-12",
  time: "13:30 – finish",
  location: "Bagi Kopi Margonda, Depok",
};

export default function DashboardPage() {
  const { user, profile, status } = useAuth();

  if (status === "checking") {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[{ label: "Dashboard", href: "/app/dashboard" }]} />
        <PageHeader title="Dashboard" description="Loading..." className="mt-8" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appModules.map((module) => (
            <Link key={module.name} href={module.href} className="block">
              <Card className="h-full">
                <div className="skeleton h-20 w-full" />
                <div className="mt-4 space-y-3">
                  <div className="skeleton h-6 w-1/3" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    );
  }

  if (!user || !profile) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[{ label: "Dashboard", href: "/app/dashboard" }]} />
        <PageHeader title="Dashboard" description="Please sign in to access the dashboard." className="mt-8" />
      </Container>
    );
  }

  const displayName = profile.full_name ?? user.email?.split("@")[0] ?? "Member";

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[{ label: "Dashboard", href: "/app/dashboard" }]} />

      {/* Header with Greeting */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="type-h1 font-medium">{greeting}, {displayName}.</h1>
            <p className="type-body text-text-secondary mt-1">Here&apos;s what&apos;s happening in NCD.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="info" className="text-xs">{profile.role}</Badge>
            <Avatar name={profile.full_name ?? user.email ?? "User"} className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Organization Snapshot */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Organization Snapshot</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <p className="type-caption text-text-muted mb-1">Members</p>
            <p className="type-h2 font-medium text-text-primary">{members.length}</p>
            <p className="type-small text-text-secondary mt-1">15 members across 3 teams</p>
          </Card>
          <Card className="p-6">
            <p className="type-caption text-text-muted mb-1">Teams</p>
            <p className="type-h2 font-medium text-text-primary">3</p>
            <p className="type-small text-text-secondary mt-1">Team 1, Team 2, Team 3</p>
          </Card>
          <Card className="p-6">
            <p className="type-caption text-text-muted mb-1">Divisions</p>
            <p className="type-h2 font-medium text-text-primary">3</p>
            <p className="type-small text-text-secondary mt-1">People & Culture, Competition & Strategy, Project & Development</p>
          </Card>
        </div>
      </section>

      {/* Current Focus: UGP-GBIC */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-h3 font-medium">Current Focus</h2>
          <Badge tone="warning">UGP-GBIC</Badge>
        </div>
        <p className="type-body text-text-secondary mb-6 max-w-2xl">
          NCD is participating in UGP-GBIC (Universitas Gunadarma Programming - Global Business Innovation Challenge) 
          with three teams across Technology, Digital Business, and Manufacturing fields.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {ugpTeams.map((team) => (
            <Card key={team.name} className="p-6 hover:border-ncd-electric/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
                  <team.icon className="size-6" />
                </div>
                <div>
                  <h3 className="type-h4 font-medium">{team.name}</h3>
                  <p className="type-caption text-text-muted">{team.field}</p>
                </div>
              </div>
              <div className="mb-4 p-4 rounded-lg bg-ncd-surface/50 border border-border">
                <dt className="type-caption text-text-muted mb-1">Product / Idea</dt>
                <dd className="type-h4 font-medium text-text-primary">{team.product}</dd>
              </div>
              <p className="type-small text-text-secondary">{team.members} members</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Activity */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Upcoming Activity</h2>
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="type-h4 font-medium mb-2">{upcomingActivity.title}</h3>
              <p className="type-body text-text-secondary mb-4">
                Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="size-4" />
                  <span className="font-medium text-text-secondary">{formatDate(upcomingActivity.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <Clock className="size-4" />
                  <span className="font-medium text-text-secondary">{upcomingActivity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <MapPin className="size-4" />
                  <span className="font-medium text-text-secondary">{upcomingActivity.location}</span>
                </div>
              </div>
            </div>
            <Link 
              href="/activities" 
              className="flex-shrink-0"
            >
              <Button variant="secondary" className="h-11">
                View Details
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Latest News */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-h3 font-medium">Latest News</h2>
          <Link href="/news" className="type-small text-ncd-electric hover:underline flex items-center gap-1">
            View all
            <Newspaper className="size-3" />
          </Link>
        </div>
        <Card className="p-6 hover:border-ncd-electric/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="info">Organization</Badge>
            <time className="type-caption text-text-muted">{formatDate("2026-10-12")}</time>
          </div>
          <h3 className="type-h4 font-medium mb-2">Offline NCD Meeting: Organization Structure & Period I Work Program</h3>
          <p className="type-small text-text-secondary line-clamp-2">
            Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.
          </p>
        </Card>
      </section>

      {/* Quick Access */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appModules.map((module) => (
            <Link key={module.name} href={module.href} className="block">
              <Card className="group hover:border-ncd-electric/50 hover:bg-ncd-hover transition-all h-full">
                <div className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors">
                    <module.icon className="size-6" aria-hidden />
                  </div>
                  <div>
                    <h3 className="type-h4 font-medium text-text-primary group-hover:text-ncd-electric transition-colors">{module.name}</h3>
                    <p className="mt-1 type-small text-text-secondary">{module.text}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Additional Quick Links */}
      <section>
        <h2 className="type-h3 font-medium mb-6">More</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/news" className="block">
            <Card className="p-4 hover:border-ncd-electric/50 hover:bg-ncd-hover transition-colors group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors">
                  <Newspaper className="size-5" />
                </div>
                <div>
                  <p className="type-body font-medium text-text-primary">News</p>
                  <p className="type-caption text-text-muted">Latest announcements</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/people" className="block">
            <Card className="p-4 hover:border-ncd-electric/50 hover:bg-ncd-hover transition-colors group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success group-hover:bg-success group-hover:text-text-primary transition-colors">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="type-body font-medium text-text-primary">People</p>
                  <p className="type-caption text-text-muted">Members & leadership</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/app/profile" className="block">
            <Card className="p-4 hover:border-ncd-electric/50 hover:bg-ncd-hover transition-colors group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning group-hover:bg-warning group-hover:text-text-primary transition-colors">
                  <Avatar name={displayName} className="h-5 w-5" />
                </div>
                <div>
                  <p className="type-body font-medium text-text-primary">Profile</p>
                  <p className="type-caption text-text-muted">Your account settings</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </Container>
  );
}