import Link from "next/link";
import { footerNav, } from "@/config/navigation";
import { site } from "@/config/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ncd-dark pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 py-12 md:grid-cols-[1fr_auto] md:px-6 md:py-16 lg:px-8 xl:px-12">
        <div className="max-w-sm">
          <p className="type-h4">{site.name}</p>
          <p className="type-body mt-2 text-text-secondary">{site.tagline}</p>
          <p className="type-small mt-4 text-text-secondary">The digital home of NCD.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-12">
          {footerNav.map((group) => (
            <div key={group.heading}>
              <p className="type-small font-medium text-text-primary">{group.heading}</p>
              <ul className="mt-3 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="type-small inline-flex min-h-11 items-center text-text-secondary hover:text-text-primary hover:underline md:min-h-8"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
