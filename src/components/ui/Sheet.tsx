"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: React.ReactNode;
};

/**
 * Drawer built on the native <dialog>: focus trap, Esc to close and inert
 * background come from the browser. Focus returns to the trigger on close.
 */
export function Sheet({ open, onClose, title, side = "right", children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 h-dvh max-h-none w-[min(88vw,360px)] max-w-none border-border-strong bg-ncd-elevated p-0 text-text-primary shadow-overlay backdrop:bg-black/60",
        side === "right" ? "mr-0 ml-auto border-l" : "mr-auto ml-0 border-r",
      )}
    >
      <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <p className="type-h4">{title}</p>
          <IconButton aria-label="Close menu" onClick={onClose}>
            <X className="size-5" aria-hidden />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </dialog>
  );
}
