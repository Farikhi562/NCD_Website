"use client";

import type { ReactNode } from "react";
import { Card } from "./Card";

type AuthShellProps = {
  children: ReactNode;
  /** Content to show on the left side (desktop only) */
  brandSection?: ReactNode;
  /** Whether to center the form vertically */
  centerVertically?: boolean;
};

/**
 * Shared shell for authentication pages.
 * Provides consistent two-column layout on desktop, single-column on mobile.
 */
export function AuthShell({ children, brandSection, centerVertically = true }: AuthShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Brand Section - Left side on desktop */}
      {brandSection && (
        <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center p-12 md:p-16 lg:p-24 relative overflow-hidden min-h-screen">
          {brandSection}
        </div>
      )}

      {/* Auth Section - Right side on desktop, full width on mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        {centerVertically && <div className="hidden lg:flex lg:flex-1" />}

        <main id="main" className={`flex-1 flex ${centerVertically ? "items-center justify-center" : "items-start justify-center"} p-6 md:p-8 lg:p-12 w-full`}>
          <Card className="w-full max-w-[420px]">
            {children}
          </Card>
        </main>

        {centerVertically && <div className="hidden lg:flex lg:flex-1" />}
      </div>
    </div>
  );
}