"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { NavLink } from "./NavLink";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { useAuth } from "@/lib/auth";
import { publicPrimaryNav, publicSecondaryNav } from "@/config/navigation";

/**
 * Public header (design.md §14). Text wordmark only: no NEXA logo, no invented NCD logo (D-01, D-02).
 * Auth-aware: shows Login/Register for visitors, Profile/Logout for authenticated users.
 */
export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-ncd-black pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
          <Link href="/" aria-label="NCD home" className="type-h4 -mx-2 rounded-md px-2 py-2 tracking-tight">
            NCD
          </Link>
        </div>
      </header>
    );
  }

  const isAuthenticated = !!user;
  const secondaryNav = isAuthenticated
    ? [
        { label: "Profile", href: "/app/profile" },
        { label: "Logout", href: "#", onClick: handleSignOut },
      ]
    : publicSecondaryNav;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ncd-black pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" aria-label="NCD home" className="type-h4 -mx-2 rounded-md px-2 py-2 tracking-tight">
            NCD
          </Link>
          <nav aria-label="Primary" className="hidden items-center md:flex">
            {publicPrimaryNav.map((item) => (
              <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
            ))}
          </nav>
        </div>
        <nav aria-label="Secondary" className="hidden items-center md:flex gap-2">
          {secondaryNav.map((item) =>
            item.onClick ? (
              <button
                key={item.href}
                onClick={item.onClick}
                className="type-small rounded-md px-3 py-2 font-medium text-text-secondary hover:text-text-primary hover:bg-ncd-hover transition-colors duration-150 flex items-center gap-2"
              >
                {item.label === "Logout" && <LogOut className="size-4" />}
                {item.label}
              </button>
            ) : (
              <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
            )
          )}
        </nav>
        <div className="md:hidden">
          <IconButton aria-label="Open menu" aria-haspopup="dialog" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>

      <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu">
        <nav aria-label="Primary" className="flex flex-col gap-1">
          {publicPrimaryNav.map((item) => (
            <NavLink key={item.href} href={item.href} variant="list" onNavigate={() => setMobileOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="my-4 border-t border-border" />
        <nav aria-label="Secondary" className="flex flex-col gap-1">
          {secondaryNav.map((item) =>
            item.onClick ? (
              <button
                key={item.href}
                onClick={item.onClick}
                className="type-small min-h-11 w-full rounded-md px-3 flex items-center justify-start gap-2 text-text-secondary hover:text-text-primary hover:bg-ncd-hover transition-colors duration-150"
              >
                {item.label === "Logout" && <LogOut className="size-4" />}
                {item.label}
              </button>
            ) : (
              <NavLink key={item.href} href={item.href} variant="list" onNavigate={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </Sheet>
    </header>
  );
}