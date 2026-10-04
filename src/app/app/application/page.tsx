"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import type { MembershipApplication } from "@/lib/database.types";
import { applicationStatusCopy } from "@/config/membership";

const OWN_APPLICATION_COLUMNS =
  "id, status, submitted_at, reviewed_at, document_type, full_name, member_id";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-0">
      <dt className="type-small text-text-muted">{label}</dt>
      <dd className="type-small text-right font-medium text-text-primary">{value}</dd>
    </div>
  );
}

export default function MyApplicationPage() {
  const { status: authStatus, user, profile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const profileNpm = profile?.npm ?? "";

  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [isMember, setIsMember] = useState(false);

  // No state is set before the first `await`, so calling this from an effect
  // never triggers a cascading render (react-hooks/set-state-in-effect).
  const load = useCallback(async () => {
    if (authStatus !== "authenticated" || !user) return;

    try {
      const { data, error } = await supabase
        .from("membership_applications")
        .select(OWN_APPLICATION_COLUMNS)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setApplication((data as unknown as MembershipApplication | null) ?? null);

      // Already in the directory? Approved members (and anyone matched by NPM)
      // have no application to review.
      const { data: byId } = await supabase.from("members").select("id").eq("id", user.id).maybeSingle();

      let memberRow = byId;
      if (!memberRow && profileNpm) {
        const { data: byNpm } = await supabase
          .from("members")
          .select("id")
          .eq("npm", profileNpm)
          .limit(1)
          .maybeSingle();
        memberRow = byNpm;
      }
      setIsMember(Boolean(memberRow));
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [authStatus, user, profileNpm, supabase]);

  useEffect(() => {
    // Deferred (kas/page.tsx does the same) so the effect body itself never
    // runs a state update synchronously.
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <Container className="py-8 md:py-12">
      <PageHeader
        title="My application"
        description="Your NCD membership application, and where it stands right now."
        className="mb-8"
      />

      {authStatus !== "checking" && authStatus !== "authenticated" && (
        <ErrorState
          title="Your session could not be verified"
          description="Sign in again to see your application status."
          actions={<ButtonLink href="/login?redirect=/app/application">Sign in</ButtonLink>}
        />
      )}

      {loadState === "loading" && (
        <div className="skeleton h-48 w-full rounded-lg" aria-busy="true" aria-label="Loading your application" />
      )}

      {loadState === "error" && (
        <ErrorState
          title="We could not load your application."
          description="Something went wrong while reading your application status. Please try again."
          actions={
            <Button
              onClick={() => {
                setLoadState("loading");
                void load();
              }}
              icon={<RefreshCw className="size-4" aria-hidden />}
            >
              Try again
            </Button>
          }
        />
      )}

      {loadState === "ready" && !application && !isMember && (
        <EmptyState
          icon={FileText}
          title="No application yet"
          description="Membership applications appear here once you submit one. If your NCD record already exists in the member directory, you do not need to apply."
          action={<ButtonLink href="/join">Apply to join NCD</ButtonLink>}
        />
      )}

      {loadState === "ready" && !application && isMember && (
        <Card>
          <CardTitle>You are an NCD member</CardTitle>
          <p className="type-body mt-3 max-w-[60ch] text-text-secondary">
            Your membership is already recorded in the NCD member directory, so there is no application waiting for
            review. Your member profile is available under People.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/app/people">Open People</ButtonLink>
            <ButtonLink href="/app/profile" variant="ghost">
              Edit my profile
            </ButtonLink>
          </div>
        </Card>
      )}

      {loadState === "ready" && application && (
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={applicationStatusCopy[application.status].tone}>
              {applicationStatusCopy[application.status].label}
            </Badge>
            <span className="type-small text-text-muted">
              Reference {application.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <CardTitle className="mt-4">{applicationStatusCopy[application.status].title}</CardTitle>
          <p className="type-body mt-3 max-w-[60ch] text-text-secondary">
            {applicationStatusCopy[application.status].description}
          </p>

          <dl className="mt-6 border-t border-border">
            <Row label="Full name" value={application.full_name} />
            <Row label="NPM" value={application.npm} />
            <Row label="University" value={application.university} />
            <Row label="Faculty" value={application.faculty} />
            <Row label="Study program" value={application.study_program} />
            <Row label="Current semester" value={`Semester ${application.semester}`} />
            <Row label="Verification document" value={application.document_type} />
            <Row
              label="Submitted"
              value={new Date(application.submitted_at).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
            {application.reviewed_at && (
              <Row
                label="Last updated"
                value={
                  new Date(application.reviewed_at).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                }
              />
            )}
          </dl>

          <p className="type-small mt-6 text-text-muted">
            Your KRS or KTM stays private: it is only visible to NCD administrators reviewing this application.
          </p>
        </Card>
      )}
    </Container>
  );
}
