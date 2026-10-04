import type { Metadata } from "next";
import { Calendar, Clock, ListChecks, Map, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/utils";
import { splitActivities, type NcdActivity } from "@/config/activities";

export const metadata: Metadata = {
  title: "Activities",
  description: "Member activity workspace.",
};

export const dynamic = "force-dynamic";

function ActivityCard({ activity, upcoming }: { activity: NcdActivity; upcoming: boolean }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">{activity.category}</Badge>
        <Badge tone={upcoming ? "warning" : "archived"}>{upcoming ? "Upcoming" : "Past"}</Badge>
      </div>
      <h3 className="type-h4 mt-3 font-medium">{activity.title}</h3>
      <p className="type-small mt-2 max-w-[65ch] text-text-secondary">{activity.description}</p>

      <dl className="type-small mt-5 grid gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 size-4 text-text-muted" aria-hidden />
          <div><dt className="type-caption text-text-muted">Date</dt><dd className="font-medium">{formatDate(activity.date)}</dd></div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 size-4 text-text-muted" aria-hidden />
          <div><dt className="type-caption text-text-muted">Time</dt><dd className="font-medium">{activity.time}</dd></div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 text-text-muted" aria-hidden />
          <div>
            <dt className="type-caption text-text-muted">Location</dt>
            <dd className="font-medium">{activity.location}</dd>
            {activity.locationUrl && (
              <dd className="mt-1">
                <a href={activity.locationUrl} target="_blank" rel="noopener noreferrer" className="type-caption inline-flex items-center gap-1 text-ncd-electric hover:underline">
                  <Map className="size-3" aria-hidden />Open in Maps
                </a>
              </dd>
            )}
          </div>
        </div>
      </dl>

      <div className="mt-6 grid gap-6 border-t border-border pt-5 md:grid-cols-2">
        <div>
          <h4 className="type-small flex items-center gap-2 font-medium"><ListChecks className="size-4 text-text-muted" aria-hidden />Agenda</h4>
          <ol className="type-small mt-3 list-inside list-decimal space-y-1.5 text-text-secondary">
            {activity.agenda.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
        <div className="space-y-4">
          {activity.audience && (
            <div>
              <h4 className="type-small flex items-center gap-2 font-medium"><Users className="size-4 text-text-muted" aria-hidden />Who it&apos;s for</h4>
              <p className="type-small mt-2 text-text-secondary">{activity.audience}</p>
            </div>
          )}
          <div>
            <h4 className="type-small font-medium">Documentation</h4>
            <p className="type-small mt-2 text-text-muted">{upcoming ? "Added after the activity takes place." : "None recorded yet."}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function WorkspaceActivitiesPage() {
  const { upcoming, past } = splitActivities();

  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Activities" description="Your member activity workspace: what's coming up, the agenda, and what's behind us." />

      <section aria-labelledby="upcoming-heading" className="mt-8">
        <h2 id="upcoming-heading" className="type-h4 mb-4 font-medium">Upcoming</h2>
        {upcoming.length === 0 ? (
          <EmptyState icon={Calendar} title="Nothing scheduled" description="Upcoming NCD activities will appear here." />
        ) : (
          <div className="space-y-4">{upcoming.map((a) => <ActivityCard key={a.id} activity={a} upcoming />)}</div>
        )}
      </section>

      <section aria-labelledby="past-heading" className="mt-10">
        <h2 id="past-heading" className="type-h4 mb-4 font-medium">Past</h2>
        {past.length === 0 ? (
          <EmptyState icon={Calendar} title="No past activities yet" description="Activities that have taken place will be kept here." />
        ) : (
          <div className="space-y-4">{past.map((a) => <ActivityCard key={a.id} activity={a} upcoming={false} />)}</div>
        )}
      </section>
    </Container>
  );
}
