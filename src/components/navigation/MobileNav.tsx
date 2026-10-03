"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { IconButton } from "@/components/ui/IconButton";
import { NavLink } from "./NavLink";
import { publicPrimaryNav, publicSecondaryNav } from "@/config/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <IconButton aria-label="Open menu" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Menu className="size-5" aria-hidden />
      </IconButton>
      <Sheet open={open} onClose={close} title="Menu">
        <nav aria-label="Primary" className="flex flex-col gap-1">
          {publicPrimaryNav.map((item) => (
            <NavLink key={item.href} href={item.href} variant="list" onNavigate={close}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="my-4 border-t border-border" />
        <nav aria-label="Secondary" className="flex flex-col gap-1">
          {publicSecondaryNav.map((item) => (
            <NavLink key={item.href} href={item.href} variant="list" onNavigate={close}>{item.label}</NavLink>
          ))}
        </nav>
      </Sheet>
    </>
  );
}
