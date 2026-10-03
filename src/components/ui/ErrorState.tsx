import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
};

/** Short, non-blaming, with a recovery action (design.md §25). */
export function ErrorState({ title = "Something went wrong.", description, actions, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn("rounded-lg border border-border-strong bg-ncd-surface p-8 md:p-12", className)}>
      <p className="type-h4 text-text-primary">{title}</p>
      <p className="type-body mt-2 max-w-[60ch] text-text-secondary">{description}</p>
      {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
