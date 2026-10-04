import type { Metadata } from "next";
import { Eye, Wallet, TrendingUp, TrendingDown, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { emptyStates } from "@/config/content";

export const metadata: Metadata = {
  title: "Transparency",
  description: "What NCD chooses to make public about its work and resources.",
  alternates: { canonical: "/transparency" },
};

export default function Page() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Transparency", href: "/transparency" }
      ]} />
      <PageHeader
        title="Transparency"
        description="What NCD chooses to make public about its work and resources."
        className="mb-8"
      />

      <section aria-labelledby="kas-heading" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 id="kas-heading" className="type-h3 font-medium">NCD Kas — Public Summary</h2>
          <Badge tone="neutral" className="text-xs">Public View</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center">
            <Wallet className="size-8 mx-auto text-ncd-electric mb-3" />
            <p className="type-small text-text-secondary">Current Balance</p>
            <p className="mt-2 type-h3 font-medium text-text-primary num">Not available</p>
            <p className="mt-1 type-caption text-text-muted">Requires authentication</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="size-8 mx-auto text-success mb-3" />
            <p className="type-small text-text-secondary">Total Income (All Time)</p>
            <p className="mt-2 type-h3 font-medium text-success num">Not available</p>
            <p className="mt-1 type-caption text-text-muted">Requires authentication</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingDown className="size-8 mx-auto text-danger mb-3" />
            <p className="type-small text-text-secondary">Total Expense (All Time)</p>
            <p className="mt-2 type-h3 font-medium text-danger num">Not available</p>
            <p className="mt-1 type-caption text-text-muted">Requires authentication</p>
          </Card>
        </div>
        <p className="mt-6 type-small text-text-muted text-center">
          Detailed transaction records are available to authenticated NCD members.{" "}
          <a href="/login" className="text-ncd-electric hover:underline">Sign in</a> to view full history.
        </p>
      </section>

      <section aria-labelledby="policy-heading" className="mb-12">
        <h2 id="policy-heading" className="type-h3 font-medium mb-6">Transparency Policy</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ncd-electric/20 text-ncd-electric">
                <Eye className="size-5" />
              </div>
              <h3 className="type-h4 font-medium">Member Access</h3>
            </div>
            <p className="type-body text-text-secondary">
              Authenticated NCD members can view the full transaction ledger including all income, expenses, and running balance.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/20 text-warning">
                <Lock className="size-5" />
              </div>
              <h3 className="type-h4 font-medium">Write Access</h3>
            </div>
            <p className="type-body text-text-secondary">
              Only authorized roles (as determined by NCD leadership) may create or modify entries. All entries are append-only.
            </p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="type-h3 font-medium mb-4">Public Information</h2>
        <div className="rounded-lg border border-dashed border-border-strong bg-ncd-dark p-8 md:p-12">
          <Eye className="mb-4 size-6 text-text-muted" aria-hidden />
          <p className="type-h4 text-text-primary">{emptyStates.transparency.title}</p>
          <p className="type-body mt-2 max-w-[60ch] text-text-secondary">{emptyStates.transparency.description}</p>
        </div>
      </section>
    </Container>
  );
}