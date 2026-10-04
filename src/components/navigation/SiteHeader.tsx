"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { NavLink } from "./NavLink";
import { ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { useAuth } from "@/lib/auth";
import { publicPrimaryNav, publicAuthNav } from "@/config/navigation";

/**
 * Public header (design.md §14). Text wordmark only: no NEXA logo, no invented NCD logo (D-01, D-02).
 * Public site = Discover NCD. Logged out: Login + Join NCD. Signed in: Workspace + Logout
 * (never Login / Register).
 */
export function SiteHeader() {
  const { user, status, signOut, isSigningOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const checking = status === "checking";
  const isAuthenticated = !!user && status === "authenticated";

  const logoutClass =
    "type-small flex items-center gap-2 rounded-md px-3 py-2 font-medium text-text-secondary transition-colors duration-150 hover:bg-ncd-hover hover:text-text-primary disabled:opacity-60";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ncd-black pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" aria-label="NCD home" className="type-h4 -mx-2 rounded-md px-2 py-2 tracking-tight">
            NCD
          </Link>
          <nav aria-label="Primary" className="hidden items-center lg:flex">
            {publicPrimaryNav.map((item) => (
              <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex" aria-label="Account">
          {checking ? null : isAuthenticated ? (
            <>
              <ButtonLink href="/app/dashboard" size="sm">Open Workspace</ButtonLink>
              <button type="button" onClick={signOut} disabled={isSigningOut} className={logoutClass}>
                <LogOut className="size-4" aria-hidden />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink href={publicAuthNav.login.href}>{publicAuthNav.login.label}</NavLink>
              <ButtonLink href={publicAuthNav.join.href} size="sm">{publicAuthNav.join.label}</ButtonLink>
            </>
          )}
        </div>

        <div className="lg:hidden">
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
        <div className="flex flex-col gap-2">
          {checking ? null : isAuthenticated ? (
            <>
              <ButtonLink href="/app/dashboard" onClick={() => setMobileOpen(false)} className="w-full">Open Workspace</ButtonLink>
              <button type="button" onClick={signOut} disabled={isSigningOut} className={`${logoutClass} min-h-11 w-full justify-start`}>
                <LogOut className="size-4" aria-hidden />
                Logout
              </button>
            </>
          ) : (
            <>
              <ButtonLink href={publicAuthNav.join.href} onClick={() => setMobileOpen(false)} className="w-full">{publicAuthNav.join.label}</ButtonLink>
              <NavLink href={publicAuthNav.login.href} variant="list" onNavigate={() => setMobileOpen(false)}>{publicAuthNav.login.label}</NavLink>
            </>
          )}
        </div>
      </Sheet>
    </header>
  );
}
