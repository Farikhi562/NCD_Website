"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  variant?: "bar" | "list";
};

/** Active state: accent indicator + aria-current="page" (design.md §14). */
export function NavLink({ href, children, onNavigate, variant = "bar" }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "type-small relative inline-flex items-center font-medium transition-colors duration-150 ease-ncd",
        variant === "bar" &&
          "h-14 px-3 hover:bg-ncd-hover aria-[current=page]:text-text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-transparent aria-[current=page]:after:bg-ncd-electric",
        variant === "list" &&
          "min-h-11 w-full rounded-md px-3 hover:bg-ncd-hover aria-[current=page]:bg-accent-tint aria-[current=page]:text-text-primary",
        !active && "text-text-secondary",
      )}
    >
      {children}
    </Link>
  );
}
