"use client";

import { useState, useEffect, useCallback } from "react";
import { Wallet, Plus, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

interface KasTransaction {
  id: string;
  date: string;
  description: string;
  income: number;
  expense: number;
  balance: number;
  category: string | null;
  reference: string | null;
  created_by: string;
  created_at: string;
}

export default function KasPage() {
  const { profile, loading: authLoading, isTreasurer, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<KasTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    income: "",
    expense: "",
    category: "",
    reference: "",
  });

  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("kas_transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        fetchTransactions();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authLoading, fetchTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTreasurer && !isAdmin) return;

    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const income = Number(formData.income) || 0;
    const expense = Number(formData.expense) || 0;

    const lastTx = transactions[0];
    const lastBalance = lastTx ? Number(lastTx.balance) : 0;
    const newBalance = lastBalance + income - expense;

    const { error } = await supabase.from("kas_transactions").insert({
      date: formData.date,
      description: formData.description,
      income,
      expense,
      balance: newBalance,
      category: formData.category || null,
      reference: formData.reference || null,
      created_by: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        income: "",
        expense: "",
        category: "",
        reference: "",
      });
      fetchTransactions();
    }
  };

  const canViewInternal = !!profile;
  const canManage = isTreasurer || isAdmin;

  if (authLoading || loading) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Kas", href: "/app/kas" }
        ]} />
        <PageHeader title="Kas NCD" description="Transparent financial tracking." className="mt-8" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="p-6"><div className="skeleton h-8 w-24" /><div className="mt-4 skeleton h-12 w-32" /></Card>
          <Card className="p-6"><div className="skeleton h-8 w-24" /><div className="mt-4 skeleton h-12 w-32" /></Card>
          <Card className="p-6"><div className="skeleton h-8 w-24" /><div className="mt-4 skeleton h-12 w-32" /></Card>
        </div>
        <div className="mt-8 skeleton h-64" />
      </Container>
    );
  }

  const totalIncome = transactions.reduce((sum, t) => sum + Number(t.income), 0);
  const totalExpense = transactions.reduce((sum, t) => sum + Number(t.expense), 0);
  const currentBalance = transactions[0] ? Number(transactions[0].balance) : 0;

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Kas", href: "/app/kas" }
      ]} />
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader title="Kas NCD" description={canViewInternal ? "Transparent financial tracking for NCD." : "Public transparency view of NCD finances."} />
        {canManage && (
          <Button onClick={() => setShowForm(!showForm)} icon={<Plus className="size-4" />}>
            {showForm ? "Cancel" : "Add Transaction"}
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <p className="type-small text-text-secondary">Total Income</p>
          <p className="mt-2 type-h3 font-medium text-success num">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card className="p-6">
          <p className="type-small text-text-secondary">Total Expense</p>
          <p className="mt-2 type-h3 font-medium text-danger num">{formatCurrency(totalExpense)}</p>
        </Card>
        <Card className="p-6">
          <p className="type-small text-text-secondary">Current Balance</p>
          <p className="mt-2 type-h3 font-medium text-text-primary num">{formatCurrency(currentBalance)}</p>
        </Card>
      </div>

      {canManage && showForm && (
        <Card className="mt-8 p-6">
          <h3 className="type-h4 font-medium mb-4">Add Transaction</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field id="tx-date" label="Date" required>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </Field>
            <Field id="tx-description" label="Description" required>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Sponsorship, Venue rental"
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
                required
              />
            </Field>
            <Field id="tx-income" label="Income (Rp)">
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                placeholder="0"
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </Field>
            <Field id="tx-expense" label="Expense (Rp)">
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.expense}
                onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
                placeholder="0"
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </Field>
            <Field id="tx-category" label="Category" className="md:col-span-2">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Sponsorship, Operations, Event"
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </Field>
            <Field id="tx-reference" label="Reference #" className="md:col-span-2">
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Receipt #, Invoice #"
                className="w-full rounded-md bg-ncd-surface border border-border px-3 py-2 text-text-primary placeholder-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20"
              />
            </Field>
            <div className="md:col-span-4 flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" icon={<Plus className="size-4" />}>Add Transaction</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-8">
        {transactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={canViewInternal ? "No transactions documented yet." : "No public transaction data available."}
            description={canViewInternal
              ? "Transactions will appear here once added by treasurer/admin."
              : "Detailed financial information is available to authenticated members."}
          />
        ) : (
          <Card>
            <Table caption="Kas transactions">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-right">Income</th>
                  <th className="text-right">Expense</th>
                  <th className="text-right">Balance</th>
                  {canViewInternal && <th>Category</th>}
                  {canViewInternal && <th>Reference</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="type-small num">{formatDate(tx.date)}</td>
                    <td className="font-medium">{tx.description}</td>
                    <td className="text-right type-small num text-success">+{formatCurrency(tx.income)}</td>
                    <td className="text-right type-small num text-danger">-{formatCurrency(tx.expense)}</td>
                    <td className="text-right type-small num font-medium">{formatCurrency(tx.balance)}</td>
                    {canViewInternal && <td className="type-small text-text-secondary">{tx.category || "—"}</td>}
                    {canViewInternal && <td className="type-small text-text-secondary">{tx.reference || "—"}</td>}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-danger" role="alert">
          <AlertCircle className="size-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </Container>
  );
}