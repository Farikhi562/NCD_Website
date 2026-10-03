import { cn } from "@/lib/utils";

/** Decorative placeholder. Wrap in a region with aria-busy where it stands in for content. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("skeleton", className)} {...props} />;
}
