"use client";

import { FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/database.types";

const statusTone: Record<Project["status"], "success" | "info" | "neutral" | "archived"> = {
  active: "success",
  completed: "info",
  draft: "neutral",
  archived: "archived",
};

export default function WorkspaceProjectsPage() {
  const { projects, loading, error } = useProjects();
  const visible = projects.filter((p) => p.status !== "archived");

  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Projects" description="The project workspace: what NCD is building, its status and its timeline." />

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
            {Array.from({ length: 2 }).map((_, i) => <Card key={i}><div className="skeleton h-20 w-full" /></Card>)}
          </div>
        ) : error ? (
          <EmptyState icon={FolderKanban} title="Couldn't load projects" description="Something went wrong while loading projects. Refresh to try again." />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Projects created by NCD will appear here with their status, timeline and description. Team members, progress and documentation will show up once those are tracked."
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {visible.map((p) => (
              <li key={p.id}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="type-h4 font-medium">{p.title}</h2>
                    <Badge tone={statusTone[p.status]} className="capitalize">{p.status}</Badge>
                  </div>
                  {p.description && <p className="type-small mt-2 text-text-secondary">{p.description}</p>}
                  {(p.start_date || p.end_date) && (
                    <p className="type-caption mt-4 text-text-muted">
                      {p.start_date ? formatDate(p.start_date) : "—"} → {p.end_date ? formatDate(p.end_date) : "ongoing"}
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
