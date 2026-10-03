import { cn } from "@/lib/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: icon-only controls need an accessible name (design.md §15). */
  "aria-label": string;
};

export function IconButton({ className, children, "aria-label": label, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-text-primary transition-colors duration-150 ease-ncd hover:bg-ncd-hover disabled:text-text-disabled md:size-10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
