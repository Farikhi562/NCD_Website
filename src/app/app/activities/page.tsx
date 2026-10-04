import type { Metadata } from "next";
import { Calendar, MapPin, Users, Map } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Activities",
  description: "NCD activities record.",
};

const activities = [
  {
    id: "1",
    title: "Offline NCD Meeting: Organization Structure & Period I Work Program",
    date: "2026-10-12",
    time: "13:30 – finish",
    location: "Bagi Kopi Margonda, Depok",
    locationUrl: "https://share.google/tFM7yQGYHS4HqlASG",
    category: "Organization",
    description: "Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.",
    participants: "Period I Leadership & Division Lead Candidates",
    documentation: "Internal archive",
    outcome: "Organization structure aligned; Period I leadership confirmed; work program, vision, and mission presented.",
    agenda: [
      "Opening and Welcome by Chairperson, Mirza Danisywar Noor Wahyu",
      "Organization Structure discussion for the three permanent NCD divisions",
      "Period I Leadership alignment and roles",
      "Work Program Presentation by Vice Chairperson, Muhamad Fauzan Al Farikhi",
      "Vision & Mission Presentation by Chairperson",
      "Discussion and Alignment",
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Activities", href: "/app/activities" }
      ]} />
      <PageHeader title="Activities" description="A dated record of what NCD did and what came out of it." className="mt-8" />

      <div className="mt-8 space-y-6">
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

              {/* Time and Location */}
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-ncd-surface/50 border border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Time</dt>
                    <dd className="type-body font-medium">{activity.time}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-ncd-surface/50 border border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Location</dt>
                    <dd className="type-body font-medium">{activity.location}</dd>
                    <dd className="type-caption text-text-muted mt-1">
                      <a href={activity.locationUrl} target="_blank" rel="noopener noreferrer" className="text-ncd-electric hover:underline flex items-center gap-1">
                        <Map className="size-3" />
                        Open in Maps
                      </a>
                    </dd>
                  </div>
                </div>
              </div>

              {/* Agenda */}
              <div className="mb-4">
                <h3 className="type-h4 font-medium mb-3">Agenda</h3>
                <ol className="list-decimal list-inside space-y-2 type-body text-text-secondary">
                  {activity.agenda.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-sm pt-4 border-t border-border">
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
        <div className="mt-8">
          <div className="rounded-lg border border-dashed border-border-strong bg-ncd-dark p-8 md:p-12">
            <Calendar className="mb-4 size-6 text-text-muted" aria-hidden />
            <p className="type-h4 text-text-primary">{emptyStates.activities.title}</p>
            <p className="type-body mt-2 max-w-[60ch] text-text-secondary">{emptyStates.activities.description}</p>
          </div>
        </div>
      )}
    </Container>
  );
}