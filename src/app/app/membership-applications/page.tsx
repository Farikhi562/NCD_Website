import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ButtonLink } from "@/components/ui/Button";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MembershipApplication, MembershipCapacity } from "@/lib/database.types";
import { ApplicationReviewList } from "./ApplicationReview";

export const metadata: Metadata = {
  title: "Membership Applications",
  description: "Review and decide NCD membership applications.",
};

/**
 * Admin-only review queue.
 *
 * The caller's role is resolved from the database on the server; anonymous
 * visitors are redirected by middleware and non-admin members get the
 * permission-denied state. The application list is read with the service-role
 * client because `review_note` / `reviewer_id` are deliberately not granted to
 * browser clients (migration 004) — the decision to read them happens here,
 * after the admin check, never in the browser.
 */
export default async function MembershipApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/app/membership-applications");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <Container className="py-8 md:py-12">
        <PageHeader title="Membership Applications" description="This area is limited to NCD administrators." />
        <div className="mt-8">
          <ErrorState
            title="You don't have access to this page."
            description="Only NCD administrators can review membership applications. If you think this is a mistake, ask an administrator to check your account role."
            actions={
              <>
                <ButtonLink href="/app/dashboard">Back to dashboard</ButtonLink>
                <Link href="/app/application" className="text-ncd-lavender underline-offset-4 hover:underline">
                  View my application
                </Link>
              </>
            }
          />
        </div>
      </Container>
    );
  }

  const { data: capacityData } = await supabase.rpc("ncd_membership_capacity");
  const capacity = (capacityData as unknown as MembershipCapacity) ?? { max_members: 0, confirmed_members: 0 };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("membership_applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Could not load membership applications:", error.message);
    return (
      <Container className="py-8 md:py-12">
        <PageHeader title="Membership Applications" description="Review membership applications for NCD." />
        <div className="mt-8">
          <ErrorState
            title="Applications could not be loaded."
            description="Something went wrong while reading the application queue. Please refresh the page."
            actions={
              <ButtonLink href="/app/membership-applications" variant="secondary">
                Refresh
              </ButtonLink>
            }
          />
        </div>
      </Container>
    );
  }

  const applications = (data ?? []) as unknown as MembershipApplication[];

  return (
    <Container className="py-8 md:py-12">
      <PageHeader
        title="Membership Applications"
        description="Review student documents, then approve or decline. Approval is the only thing that creates an NCD member."
        className="mb-8"
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications yet"
          description="Applications submitted on the Join NCD page will appear here, newest first, with their KRS or KTM ready to verify."
        />
      ) : (
        <ApplicationReviewList applications={applications} capacity={capacity} />
      )}
    </Container>
  );
}
