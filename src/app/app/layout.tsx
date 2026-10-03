import { AuthHeader } from "@/components/navigation/AuthHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { AuthProvider } from "@/lib/auth";

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