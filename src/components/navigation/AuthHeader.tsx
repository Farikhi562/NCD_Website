"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { NavLink } from "./NavLink";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { appNav, appSecondaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  const { user, profile, signOut, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-ncd-black pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/app/dashboard" aria-label="NCD home" className="type-h4 -mx-2 rounded-md px-2 py-2 tracking-tight">
              NCD
            </Link>
            <nav aria-label="Primary" className="hidden items-center md:flex">
              {appNav.map((item) => (
                <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
              ))}
            </nav>
          </div>
          <div className="md:hidden">
            <IconButton aria-label="Open menu" aria-haspopup="dialog" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" aria-hidden />
            </IconButton>
          </div>
        </div>
      </header>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ncd-black pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/app/dashboard" aria-label="NCD home" className="type-h4 -mx-2 rounded-md px-2 py-2 tracking-tight">
            NCD
          </Link>
          <nav aria-label="Primary" className="hidden items-center md:flex">
            {appNav.map((item) => (
              <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
            ))}
          </nav>
        </div>
        <nav aria-label="Secondary" className="hidden items-center md:flex gap-2">
          {appSecondaryNav.map((item) =>
            item.href === "/logout" ? (
              <button
                key={item.href}
                onClick={handleSignOut}
                className="type-small rounded-md px-3 py-2 font-medium text-text-secondary hover:text-text-primary hover:bg-ncd-hover transition-colors duration-150 flex items-center gap-2"
              >
                <LogOut className="size-4" />
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
          {appNav.map((item) => (
            <NavLink key={item.href} href={item.href} variant="list" onNavigate={() => setMobileOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="my-4 border-t border-border" />
        <nav aria-label="Secondary" className="flex flex-col gap-1">
          {appSecondaryNav.map((item) =>
            item.href === "/logout" ? (
              <button
                key={item.href}
                onClick={handleSignOut}
                className="type-small min-h-11 w-full rounded-md px-3 flex items-center justify-start gap-2 text-text-secondary hover:text-text-primary hover:bg-ncd-hover transition-colors duration-150"
              >
                <LogOut className="size-4" />
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