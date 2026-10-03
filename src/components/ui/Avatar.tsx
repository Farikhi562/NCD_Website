import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = { 24: "size-6 text-[10px]", 32: "size-8 text-xs", 40: "size-10 text-sm", 64: "size-16 text-lg" } as const;

type AvatarProps = {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  className?: string;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

/** Initials on a neutral surface; no random colours (design.md §20). Photos only when approved (D-06, D-24). */
export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ncd-elevated font-medium text-text-secondary",
        sizes[size],
        className,
      )}
    >
      {src ? <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" /> : <span aria-hidden>{initials(name)}</span>}
      {!src && <span className="sr-only">{name}</span>}
    </span>
  );
}

export function AvatarGroup({ people, max = 4 }: { people: { name: string; src?: string }[]; max?: number }) {
  const visible = people.slice(0, max);
  const hidden = people.length - visible.length;
  return (
    <div className="flex items-center" role="group" aria-label={`${people.length} people`}>
      {visible.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={32} className="-ml-2 ring-2 ring-ncd-surface first:ml-0" />
      ))}
      {hidden > 0 && (
        <span
          className="num type-label -ml-2 inline-flex size-8 items-center justify-center rounded-full bg-ncd-elevated text-text-secondary ring-2 ring-ncd-surface"
          aria-label={`${hidden} more`}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
}
