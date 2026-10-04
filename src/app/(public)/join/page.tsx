import type { Metadata } from "next";
import { GraduationCap, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { JoinForm } from "@/components/membership/JoinForm";
import { getMembershipCapacity } from "@/lib/membership/capacity";
import { isFull, remainingSlots } from "@/config/membership";

export const metadata: Metadata = {
  title: "Join NCD",
  description: "Apply to become an NCD member. Build. Learn. Compete. Grow Together.",
  alternates: { canonical: "/join" },
};

const eligibility = [
  {
    icon: GraduationCap,
    title: "Active Universitas Gunadarma student",
    body: "Your KRS or KTM must show you as an active student of Universitas Gunadarma.",
  },
  {
    icon: FileCheck2,
    title: "KRS or KTM required",
    body: "Upload one document as proof of enrolment. It is stored privately and used for verification only.",
  },
  {
    icon: ShieldCheck,
    title: "Accurate information",
    body: "Everything you submit belongs to you and is used only to review your application.",
  },
  {
    icon: Users,
    title: "A reviewed, limited community",
    body: "Applications are read by NCD administrators. Membership is capped, so the team can actually get to know each member.",
  },
];

export default async function JoinPage() {
  const capacity = await getMembershipCapacity();
  const full = capacity ? isFull(capacity) : false;

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Join NCD", href: "/join" },
        ]}
      />
      <PageHeader
        title="Join NCD"
        description="Build. Learn. Compete. Grow Together."
        className="mb-8"
      />

      <section aria-labelledby="capacity-heading" className="mb-10">
        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="capacity-heading" className="type-h4 text-text-primary">
              Membership capacity
            </h2>
            {capacity ? (
              <>
                <p className="type-body mt-2 text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {capacity.confirmed_members} / {capacity.max_members} members
                  </span>
                  <span className="mx-2 text-text-muted" aria-hidden>
                    ·
                  </span>
                  <span className={full ? "text-danger" : "text-success"}>
                    {full ? "0 spots remaining" : `${remainingSlots(capacity)} spots remaining`}
                  </span>
                </p>
                <p className="type-small mt-1 text-text-muted">
                  Confirmed members are counted live from the NCD member directory.
                </p>
              </>
            ) : (
              <p className="type-body mt-2 text-text-secondary">Membership capacity is not available right now.</p>
            )}
          </div>
          {capacity && !full && (
            <Badge tone="success">Applications open</Badge>
          )}
          {full && <Badge tone="danger">Applications closed</Badge>}
        </Card>
      </section>

      {capacity && full ? (
        <section aria-labelledby="full-heading">
          <ErrorState
            title="NCD Membership is Full"
            description={`NCD has currently reached its maximum membership capacity of ${capacity.max_members} members, so we cannot accept new applications right now. Applications open again as soon as a spot becomes available.`}
          />
        </section>
      ) : capacity ? (
        <JoinForm initialCapacity={capacity} />
      ) : (
        <ErrorState
          title="Applications are unavailable"
          description="We could not load the current membership capacity. Please refresh the page or come back later."
        />
      )}

      <section aria-labelledby="eligibility-heading" className="mt-12">
        <h2 id="eligibility-heading" className="type-h2 font-medium">
          Who can apply
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {eligibility.map((item) => (
            <Card key={item.title} className="flex gap-4">
              <item.icon className="mt-0.5 size-5 shrink-0 text-ncd-lavender" aria-hidden />
              <div>
                <h3 className="type-h4 text-text-primary">{item.title}</h3>
                <p className="type-small mt-2 text-text-secondary">{item.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
