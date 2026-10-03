import type { LucideIcon } from "lucide-react";
import { Badge } from "./Badge";
import { Container } from "./Container";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";
import { cn } from "@/lib/utils";

type ModulePageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  empty: { title: string; description: string };
  className?: string;
};

/**
 * Phase 1 placeholder for a public module. Real data arrives in later phases;
 * until then the page shows an honest empty state, never invented content.
 */
export function ModulePage({ title, description, icon, empty, className }: ModulePageProps) {
  return (
    <Container className={cn("py-12 md:py-16", className)}>
      <PageHeader title={title} description={description} actions={<Badge tone="info">Coming soon</Badge>} />
      <div className="mt-12">
        <EmptyState icon={icon} title={empty.title} description={empty.description} />
      </div>
    </Container>
  );
}
