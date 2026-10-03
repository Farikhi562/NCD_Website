import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the real page: title block, then one content region (design.md §24). */
export default function Loading() {
  return (
    <Container className="py-12 md:py-16" aria-busy="true">
      <span className="sr-only" role="status">Loading</span>
      <Skeleton className="h-10 w-48 md:h-12" />
      <Skeleton className="mt-4 h-6 w-full max-w-[640px]" />
      <Skeleton className="mt-12 h-48 w-full rounded-lg" />
    </Container>
  );
}
