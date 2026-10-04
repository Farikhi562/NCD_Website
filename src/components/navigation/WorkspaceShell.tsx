"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { appNavGroups } from "@/config/navigation";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { profile, user, signOut, isSigningOut, isAdmin } = useAuth();
  const name = profile?.full_name ?? user?.email?.split("@")[0] ?? "Member";

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Workspace" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {appNavGroups.map((group) => {
          const items = group.items.filter((item) => !item.adminOnly || isAdmin);
          if (items.length === 0) return null;
          return (
          <div key={group.heading}>
            <p className="type-label px-3 pb-2 text-text-muted uppercase tracking-wider">{group.heading}</p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "type-small flex min-h-10 items-center rounded-md px-3 font-medium transition-colors duration-150 ease-ncd hover:bg-ncd-hover",
                        active ? "bg-accent-tint text-text-primary" : "text-text-secondary",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/app/profile"
          onClick={onNavigate}
          aria-current={isActive(pathname, "/app/profile") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 ease-ncd hover:bg-ncd-hover",
            isActive(pathname, "/app/profile") && "bg-accent-tint",
          )}
        >
          <Avatar name={name} src={profile?.avatar_url} size={32} />
          <span className="min-w-0">
            <span className="type-small block truncate font-medium text-text-primary">{name}</span>
            <span className="type-caption block text-text-muted">Profile</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="type-small mt-1 flex min-h-10 w-full items-center gap-2 rounded-md px-3 font-medium text-text-secondary transition-colors duration-150 ease-ncd hover:bg-ncd-hover hover:text-text-primary disabled:opacity-60"
        >
          <LogOut className="size-4" aria-hidden />
          {isSigningOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </div>
  );
}

function ShellMessage({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="type-h3">{title}</p>
        <p className="type-body mt-2 text-text-secondary">{description}</p>
        {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

/**
 * The signed-in product shell. One layout for every /app/* page:
 *  - guards the route (signed out -> /login, onboarding not done -> /app/onboarding)
 *  - sidebar on desktop, drawer on mobile
 * Onboarding renders without the sidebar so the first-run flow stays focused.
 */
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { status, profile, needsOnboarding, isSigningOut, signOut, refreshProfile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOnboarding = pathname === "/app/onboarding";

  useEffect(() => {
    if (isSigningOut) return;
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (status === "authenticated" && profile && needsOnboarding && !isOnboarding) {
      router.replace("/app/onboarding");
    }
  }, [status, profile, needsOnboarding, isOnboarding, isSigningOut, pathname, router]);

  if (status === "checking") {
    return (
      <div className="flex min-h-dvh" aria-busy="true">
        <div className="hidden w-60 shrink-0 border-r border-border lg:block" />
        <div className="flex-1 p-8">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton mt-6 h-32 w-full max-w-3xl" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <ShellMessage title="Couldn't reach NCD" description="We couldn't check your session. Check your connection and try again.">
        <Button onClick={() => window.location.reload()}>Try again</Button>
        <Button variant="secondary" onClick={signOut}>Log out</Button>
      </ShellMessage>
    );
  }

  if (status === "unauthenticated") {
    return <ShellMessage title="Redirecting to login…" description="You need to sign in to open the NCD Workspace." />;
  }

  if (!profile) {
    return (
      <ShellMessage title="Couldn't load your profile" description="You're signed in, but your profile didn't load. Try again, or log out and back in.">
        <Button onClick={() => void refreshProfile()}>Try again</Button>
        <Button variant="secondary" onClick={signOut}>Log out</Button>
      </ShellMessage>
    );
  }

  if (needsOnboarding && !isOnboarding) {
    return <ShellMessage title="Setting up your workspace…" description="Taking you to onboarding." />;
  }

  if (isOnboarding) {
    return <main id="main" className="flex-1">{children}</main>;
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-ncd-black pt-[env(safe-area-inset-top)] lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-6">
          <Link href="/app/dashboard" aria-label="NCD Workspace home" className="type-h4 tracking-tight">NCD</Link>
          <span className="type-caption text-text-muted">Workspace</span>
        </div>
        <div className="min-h-0 flex-1"><SidebarBody /></div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-ncd-black px-4 pt-[env(safe-area-inset-top)] lg:hidden">
          <Link href="/app/dashboard" aria-label="NCD Workspace home" className="type-h4 tracking-tight">
            NCD <span className="type-caption ml-1 text-text-muted">Workspace</span>
          </Link>
          <IconButton aria-label="Open menu" aria-haspopup="dialog" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" aria-hidden />
          </IconButton>
        </header>
        <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)} title="Workspace">
          <SidebarBody onNavigate={() => setMobileOpen(false)} />
        </Sheet>
        <main id="main" className="flex-1">{children}</main>
      </div>
    </div>
  );
}
