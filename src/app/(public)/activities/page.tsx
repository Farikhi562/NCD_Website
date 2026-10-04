import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Activities",
  description: "A dated record of what NCD did and what came out of it.",
  alternates: { canonical: "/activities" },
};

const activities = [
  {
    id: "1",
    title: "Offline NCD Meeting",
    date: "2026-10-12",
    location: "NEXA Tech Labs Office, Bandung",
    category: "Organization",
    description: "Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.",
    participants: "Period I Leadership & Division Lead Candidates",
    documentation: "Internal archive",
    outcome: "Division lead elections initiated; work program presented; vision & mission shared.",
  },
];

export default function Page() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Activities", href: "/activities" }
      ]} />
      <PageHeader
        title="Activities"
        description="A dated record of what NCD did and what came out of it."
        className="mb-8"
      />

      <div className="space-y-6">
        {activities.map((activity) => (
          <article key={activity.id}>
            <Card className="p-6 hover:border-ncd-electric/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Badge tone="info">{activity.category}</Badge>
                  <time className="type-caption text-text-muted">{formatDate(activity.date)}</time>
                </div>
                <div className="flex items-center gap-4 text-text-muted type-caption">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {activity.participants}
                  </span>
                </div>
              </div>
              <h2 className="type-h4 font-medium mb-2">{activity.title}</h2>
              <p className="type-body text-text-secondary mb-4">{activity.description}</p>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div>
                  <dt className="type-caption text-text-muted mb-1">Documentation</dt>
                  <dd className="type-body text-text-secondary">{activity.documentation}</dd>
                </div>
                <div>
                  <dt className="type-caption text-text-muted mb-1">Outcome</dt>
                  <dd className="type-body text-text-secondary">{activity.outcome}</dd>
                </div>
              </div>
            </Card>
          </article>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="mt-8 text-center">
          <p className="type-body text-text-secondary">No activities recorded yet.</p>
        </div>
      )}
    </Container>
  );
}