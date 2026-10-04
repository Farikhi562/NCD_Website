import type { Metadata } from "next";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "NCD App — your dashboard.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <>
        <AuthHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </>
    </AuthProvider>
  );
}