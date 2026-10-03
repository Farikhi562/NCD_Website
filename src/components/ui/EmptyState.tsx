import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Render only when the viewer is allowed to act (design.md §23). */
  action?: React.ReactNode;
  className?: string;
};

/** What's missing → what will appear here → action only if the viewer can act. */
export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-lg border border-dashed border-border-strong bg-ncd-dark p-8 md:p-12", className)}>
      {Icon && <Icon className="mb-4 size-6 text-text-muted" aria-hidden />}
      <p className="type-h4 text-text-primary">{title}</p>
      <p className="type-body mt-2 max-w-[60ch] text-text-secondary">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
