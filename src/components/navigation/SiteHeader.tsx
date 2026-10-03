import Link from "next/link";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";
import { publicPrimaryNav, publicSecondaryNav } from "@/config/navigation";

/**
 * Public header (design.md §14). Text wordmark only: no NEXA logo, no invented NCD logo (D-01, D-02).
 */
export function SiteHeader() {
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
        <nav aria-label="Secondary" className="hidden items-center md:flex">
          {publicSecondaryNav.map((item) => (
            <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
