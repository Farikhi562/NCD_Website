import { cn } from "@/lib/utils";

/** Max content width 1280. Horizontal padding 16 / 24 / 32–48 (design.md §12). */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8 xl:px-12", className)} {...props} />;
}
