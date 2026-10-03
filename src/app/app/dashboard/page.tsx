import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, Trophy, BookOpen, Calendar, Wallet } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createClient } from "@/lib/supabase/server";
import { emptyStates } from "@/config/content";

const appModules = [
  { name: "People", href: "/app/people", icon: Users, text: "Members, skills, interests, and learning targets." },
  { name: "Projects", href: "/app/projects", icon: FolderKanban, text: "Project Lab case studies: problem, research, solution, outcome." },
  { name: "Competitions", href: "/app/competitions", icon: Trophy, text: "Competition Radar and Briefs." },
  { name: "Activities", href: "/app/activities", icon: Calendar, text: "Dated record of NCD activities and outcomes." },
  { name: "Knowledge", href: "/app/knowledge", icon: BookOpen, text: "Lessons, tutorials, and post-mortems." },
  { name: "Kas", href: "/app/kas", icon: Wallet, text: "Transparent financial tracking for NCD." },
  { name: "Squads", href: "/app/squads", icon: Users, text: "Cross-functional working groups." },
  { name: "Growth", href: "/app/growth", icon: BookOpen, text: "Personal and organizational growth tracking." },
  { name: "Documentation", href: "/app/documentation", icon: FolderKanban, text: "Internal documentation and templates." },
] as const;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "NCD App — your dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[{ label: "Dashboard", href: "/app/dashboard" }]} />
      <PageHeader title="Dashboard" description="Welcome back. Here's what's happening in NCD." className="mt-8" />
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appModules.map((module) => (
          <Link key={module.name} href={module.href} className="block">
            <Card className="group hover:border-border-strong transition-colors h-full">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors">
                  <module.icon className="size-5" aria-hidden />
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

      <div className="mt-12">
        <h2 className="type-h3 font-medium">Quick Overview</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <ModulePage title="Members" description={emptyStates.people.description} icon={Users} empty={{ title: "0 members", description: "No members added yet." }} />
          <ModulePage title="Projects" description={emptyStates.projects.description} icon={FolderKanban} empty={{ title: "0 projects", description: "No projects created yet." }} />
          <ModulePage title="Kas Balance" description="Current financial status." icon={Wallet} empty={{ title: "Rp 0", description: "No transactions recorded." }} />
        </div>
      </div>
    </Container>
  );
}