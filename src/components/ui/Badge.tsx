import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Status: semantic colour + always a text label, pill shape (design.md §19).
 * Category / Tag: neutral, radius 6. Never colour-code skills.
 */
const badgeVariants = cva("type-label inline-flex items-center gap-1 border px-2 py-1", {
  variants: {
    tone: {
      neutral: "rounded-sm border-border-strong text-text-secondary",
      success: "rounded-full border-success/30 bg-success/12 text-success",
      warning: "rounded-full border-warning/30 bg-warning/12 text-warning",
      danger: "rounded-full border-danger/30 bg-danger/12 text-danger",
      info: "rounded-full border-info/30 bg-info/12 text-info",
      archived: "rounded-full border-border-strong bg-ncd-hover text-text-secondary",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
