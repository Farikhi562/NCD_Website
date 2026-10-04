"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/auth";

export default function WorkspaceGrowthPage() {
  const { profile } = useAuth();
  const interests = profile?.interests ?? [];

  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="My Growth" description="Your personal space. Progress against your own start, never a ranking against others." />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="type-h4 font-medium">Interests</h2>
          {interests.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">{interests.map((i) => <Badge key={i}>{i}</Badge>)}</div>
          ) : (
            <p className="type-small mt-2 text-text-secondary">You haven&apos;t added interests yet. You can add them on your profile.</p>
          )}
          {profile?.bio && (
            <>
              <h2 className="type-h4 mt-6 font-medium">About you</h2>
              <p className="type-small mt-2 text-text-secondary">{profile.bio}</p>
            </>
          )}
        </Card>
        <EmptyState
          icon={TrendingUp}
          title="Growth Map isn't set up yet"
          description="Your learning targets, contributions and activities will be recorded here once Growth Map is available."
        />
      </div>
    </Container>
  );
}
