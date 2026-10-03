import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  label: string;
  className?: string;
};

/** Fill uses --ncd-electric. Always give it a text label for assistive tech. */
export function Progress({ value, label, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("h-2 w-full overflow-hidden rounded-xs bg-ncd-elevated", className)}
    >
      <div className="h-full bg-ncd-electric transition-[width] duration-300 ease-ncd" style={{ width: `${clamped}%` }} />
    </div>
  );
}
