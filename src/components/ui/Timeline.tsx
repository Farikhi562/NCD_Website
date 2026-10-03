import { cn } from "@/lib/utils";

export type TimelineEntry = {
  id: string;
  /** Pre-formatted date, rendered in mono. */
  date: string;
  title: string;
  category?: React.ReactNode;
  outcome?: string;
};

/** Vertical timeline; the accent dot marks only the most recent entry (design.md §30). */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-8 border-l border-border pl-6">
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden
            className={cn(
              "absolute top-2 -left-[29px] size-2 rounded-full",
              i === 0 ? "bg-ncd-electric" : "bg-border-strong",
            )}
          />
          <p className="num type-small text-text-secondary">{entry.date}</p>
          <p className="type-h4 mt-1">{entry.title}</p>
          {entry.category && <div className="mt-2">{entry.category}</div>}
          {entry.outcome && <p className="type-small mt-2 text-text-secondary">{entry.outcome}</p>}
        </li>
      ))}
    </ol>
  );
}
