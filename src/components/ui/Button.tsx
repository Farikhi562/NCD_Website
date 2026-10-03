import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 ease-ncd disabled:pointer-events-none disabled:text-text-disabled aria-disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-ncd-electric text-text-primary hover:brightness-110 active:brightness-90",
        secondary: "border border-border-strong bg-ncd-elevated text-text-primary hover:bg-ncd-hover",
        ghost: "text-text-primary hover:bg-ncd-hover",
        link: "text-ncd-lavender underline-offset-4 hover:underline focus-visible:underline",
        destructive: "bg-danger text-ncd-black hover:brightness-110",
      },
      size: {
        sm: "h-8 px-3 type-small",
        md: "h-10 px-4 type-small",
        lg: "h-12 px-5 type-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Variants & { loading?: boolean; icon?: React.ReactNode };

export function Button({ className, variant, size, loading, disabled, children, icon, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & Variants;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
