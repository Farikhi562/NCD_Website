import type { Metadata } from "next";
import { Eye, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { emptyStates } from "@/config/content";

const title = "Transparency";
const description = "What NCD chooses to make public about its work and resources.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/transparency" },
};

export default async function Page() {
  const supabase = await createClient();

  // Fetch public Kas summary (aggregated only, no transaction details)
  const { data: transactions } = await supabase
    .from("kas_transactions")
    .select("income, expense, balance")
    .order("date", { ascending: false })
    .limit(1);

  const totalIncome = 0; // Would need a separate public view or RPC for aggregates
  const totalExpense = 0;
  const currentBalance = transactions?.[0]?.balance ?? 0;

  return (
    <Container className="py-8 md:py-12">
      <div className="max-w-3xl">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-tint px-3 py-1 text-sm font-medium text-ncd-electric mb-4">
            <Eye className="size-4" />
            Public Transparency
          </div>
          <h1 className="type-display font-medium">{title}</h1>
          <p className="mt-4 type-lead text-text-secondary">{description}</p>
        </header>

        <section aria-labelledby="kas-heading" className="mb-16">
          <h2 id="kas-heading" className="type-h2 font-medium mb-6">Kas NCD — Public Summary</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center">
              <Wallet className="size-8 mx-auto text-ncd-electric mb-3" />
              <p className="type-small text-text-secondary">Current Balance</p>
              <p className="mt-2 type-h3 font-medium text-text-primary num">{formatCurrency(Number(currentBalance))}</p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="size-8 mx-auto text-success mb-3" />
              <p className="type-small text-text-secondary">Total Income (All Time)</p>
              <p className="mt-2 type-h3 font-medium text-success num">{formatCurrency(totalIncome)}</p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingDown className="size-8 mx-auto text-danger mb-3" />
              <p className="type-small text-text-secondary">Total Expense (All Time)</p>
              <p className="mt-2 type-h3 font-medium text-danger num">{formatCurrency(totalExpense)}</p>
            </Card>
          </div>
          <p className="mt-6 type-small text-text-muted text-center">
            Detailed transaction records are available to authenticated NCD members.{" "}
            <a href="/login" className="text-ncd-electric hover:underline">Sign in</a> to view full history.
          </p>
        </section>

        <section aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="type-h2 font-medium mb-4">Transparency Notes</h2>
          <ModulePage
            title="Transparency Policy"
            description={emptyStates.transparency.description}
            icon={Eye}
            empty={{
              title: "Nothing published yet.",
              description: "Information NCD chooses to make public will appear here.",
            }}
          />
        </section>
      </div>
    </Container>
  );
}