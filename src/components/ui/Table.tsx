import { cn } from "@/lib/utils";

/**
 * Semantic table. Wide tables scroll inside a bordered container (design.md §18).
 * Pass a caption (visually hidden is fine) so the table has an accessible name.
 */
export function Table({ caption, className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className={cn("w-full border-collapse text-left", className)} {...props}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export const THead = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-ncd-surface" {...p} />;
export const TBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />;

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-t border-border-subtle first:border-t-0 hover:bg-ncd-hover", className)} {...props} />;
}

export function TH({ className, numeric, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn("type-small h-10 px-4 font-medium text-text-secondary", numeric && "text-right", className)}
      {...props}
    />
  );
}

export function TD({ className, numeric, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return <td className={cn("type-small h-10 px-4 text-text-primary", numeric && "num text-right", className)} {...props} />;
}
