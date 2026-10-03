import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="type-small flex flex-wrap items-center gap-2 text-text-secondary">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-text-primary hover:underline">{item.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-text-primary" : undefined}>{item.label}</span>
              )}
              {!last && <ChevronRight className="size-4 text-text-muted" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
