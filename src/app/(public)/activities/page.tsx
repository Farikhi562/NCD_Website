import type { Metadata } from "next";
import { CalendarDays, MapPin, Map, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { activities, splitActivities } from "@/config/activities";

export const metadata: Metadata = {
  title: "Activities",
  description: "NCD activities record.",
  alternates: { canonical: "/activities" },
};

// Dates are compared at request time; keep this page dynamic so "upcoming" stays correct.
export const dynamic = "force-dynamic";

export default function ActivitiesPage() {
  const { upcoming, past } = splitActivities();
  const ordered = [...upcoming.map((a) => ({ a, upcoming: true })), ...past.map((a) => ({ a, upcoming: false }))];

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Activities", href: "/activities" }
      ]} />
      <PageHeader
        title="Activities"
        description="What NCD is doing: sessions, meetings and gatherings."
        className="mb-8"
      />

      <div className="space-y-6">
        {ordered.map(({ a: activity, upcoming: isUpcoming }) => (
          <article key={activity.id}>
            <Card className="p-6">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-2">
                  <Badge tone="info">{activity.category}</Badge>
                  <Badge tone={isUpcoming ? "warning" : "archived"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
                  <time className="type-caption text-text-muted" dateTime={activity.date}>{formatDate(activity.date)}</time>
                </div>
                {activity.audience && (
                  <span className="type-caption flex items-center gap-1 text-text-muted">
                    <Users className="size-3" aria-hidden />
                    {activity.audience}
                  </span>
                )}
              </div>
              <h2 className="type-h4 mb-2 font-medium">{activity.title}</h2>
              <p className="type-body mb-4 text-text-secondary">{activity.description}</p>

              <dl className="mb-4 grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-ncd-surface/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric">
                    <CalendarDays className="size-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Time</dt>
                    <dd className="type-body font-medium">{activity.time}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-ncd-surface/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric">
                    <MapPin className="size-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Location</dt>
                    <dd className="type-body font-medium">{activity.location}</dd>
                    {activity.locationUrl && (
                      <dd className="type-caption mt-1">
                        <a href={activity.locationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ncd-electric hover:underline">
                          <Map className="size-3" aria-hidden />
                          Open in Maps
                        </a>
                      </dd>
                    )}
                  </div>
                </div>
              </dl>

              <div>
                <h3 className="type-h4 mb-3 font-medium">Agenda</h3>
                <ol className="type-body list-inside list-decimal space-y-2 text-text-secondary">
                  {activity.agenda.map((item) => <li key={item}>{item}</li>)}
                </ol>
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
