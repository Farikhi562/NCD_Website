"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Users, FolderKanban, Trophy, BookOpen, Calendar, Sparkles, Mail, Lock } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { InputWithIcon } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthError } from "@/components/ui/AuthError";
import { createClient } from "@/lib/supabase/client";

const features = [
  { icon: Users, label: "Community", desc: "Connect with members across cohorts" },
  { icon: FolderKanban, label: "Projects", desc: "Build real projects together" },
  { icon: Trophy, label: "Competitions", desc: "Track and join competitions" },
  { icon: BookOpen, label: "Knowledge", desc: "Learn from shared experiences" },
  { icon: Calendar, label: "Activities", desc: "Document what happened" },
  { icon: Sparkles, label: "Growth", desc: "Grow from every experience" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/app/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "reset">("login");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("Check your email for a password reset link.");
      setMode("login");
      setLoading(false);
    }
  };

  const brandSection = (
    <div className="relative z-10 max-w-lg text-center lg:text-left">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-8">
        <Sparkles className="size-3" />
        Growth Together.
      </span>

      <h2 className="type-display font-medium tracking-tight text-text-primary leading-[1.1] mb-6">
        Build projects.<br />
        Share knowledge.<br />
        Grow together.
      </h2>

      <p className="type-lead text-text-secondary mb-12 max-w-md">
        NCD is the digital home where people, learning, projects, competitions and records connect.
      </p>

      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="group relative p-4 rounded-lg border border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover transition-all duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-tint text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors mb-3">
              <feature.icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="type-small font-medium text-text-primary group-hover:text-ncd-electric transition-colors">{feature.label}</h3>
            <p className="type-caption text-text-muted mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-ncd-electric/40 to-transparent" aria-hidden="true" />
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="type-h4 font-medium tracking-tight">NCD</span>
        <h1 className="type-h1 font-medium mt-4">Welcome back</h1>
        <p className="type-body text-text-secondary mt-2">Sign in to continue to NCD.</p>
      </div>

      <InputWithIcon
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@ncd.id"
        icon={<Mail className="size-4" />}
        disabled={loading}
        autoComplete="email"
        required
      />

      <PasswordInput
        id="login-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        disabled={loading}
        autoComplete="current-password"
        required
        className="mt-4"
      />

      {error && <AuthError message={error} />}

      <Button type="submit" disabled={loading} className="mt-6 w-full h-11">
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
      </Button>

      <p className="mt-4 text-center text-sm text-text-secondary">
        <button
          type="button"
          onClick={() => setMode("reset")}
          className="text-text-secondary hover:text-text-primary underline"
        >
          Forgot password?
        </button>
      </p>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-ncd-electric hover:underline font-medium"
        >
          Create one
        </button>
      </p>
    </form>
  );

  const renderResetForm = () => (
    <form onSubmit={handleResetRequest} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="type-h4 font-medium tracking-tight">NCD</span>
        <h1 className="type-h1 font-medium mt-4">Reset Password</h1>
        <p className="type-body text-text-secondary mt-2">Enter your email to receive a password reset link.</p>
      </div>

      <InputWithIcon
        id="reset-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@ncd.id"
        icon={<Mail className="size-4" />}
        disabled={loading}
        autoComplete="email"
        required
      />

      {error && <AuthError message={error} />}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setMode("login")} disabled={loading} className="flex-1">
          Back to Login
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-ncd-electric hover:underline font-medium"
        >
          Create one
        </button>
      </p>
    </form>
  );

  return (
    <AuthShell brandSection={brandSection}>
      {mode === "reset" ? renderResetForm() : renderLoginForm()}
    </AuthShell>
  );
}