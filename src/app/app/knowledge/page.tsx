"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { KnowledgeArticle } from "@/lib/database.types";

type Row = Pick<KnowledgeArticle, "id" | "title" | "excerpt" | "tags" | "status" | "published_at" | "created_at">;

export default function WorkspaceKnowledgePage() {
  const [articles, setArticles] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      try {
        const { data, error } = await supabase
          .from("knowledge_articles")
          .select("id, title, excerpt, tags, status, published_at, created_at")
          .neq("status", "archived")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error) setError(true);
        else setArticles((data as unknown as Row[]) ?? []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container className="py-8 md:py-12">
      <PageHeader title="Knowledge Hub" description="Your internal learning space for notes, resources, and shared knowledge." />
      <div className="mt-8">
        {loading ? (
          <Card aria-busy="true"><div className="skeleton h-20 w-full" /></Card>
        ) : error ? (
          <EmptyState icon={BookOpen} title="Couldn't load the Knowledge Hub" description="Something went wrong while loading resources. Refresh to try again." />
        ) : articles.length === 0 ? (
          <EmptyState icon={BookOpen} title="No internal resources yet" description="Notes, resources and shared knowledge will appear here once they are added." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <li key={a.id}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="type-h4 font-medium">{a.title}</h2>
                    {a.status === "draft" && <Badge tone="warning">Draft</Badge>}
                  </div>
                  {a.excerpt && <p className="type-small mt-2 text-text-secondary">{a.excerpt}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {(a.tags ?? []).map((t) => <Badge key={t}>{t}</Badge>)}
                    <span className="type-caption text-text-muted">{formatDate(a.published_at ?? a.created_at)}</span>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
