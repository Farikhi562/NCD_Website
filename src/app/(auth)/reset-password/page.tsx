"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthError } from "@/components/ui/AuthError";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/app/dashboard";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [codeExchanged, setCodeExchanged] = useState(false);

  const supabase = createClient();

  const exchangeCodeForSession = useCallback(async () => {
    if (!code) return;
    setLoading(true);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      setError("Invalid or expired reset link. Please request a new one.");
    } else {
      setCodeExchanged(true);
    }
    setLoading(false);
  }, [code, supabase]);

  useEffect(() => {
    if (code) {
      const timer = setTimeout(() => {
        exchangeCodeForSession();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [code, exchangeCodeForSession]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push(next), 1500);
    }
  };

  const brandSection = (
    <div className="relative z-10 max-w-lg text-center lg:text-left">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-8">
        <Lock className="size-3" />
        Secure Reset
      </span>

      <h2 className="type-display font-medium tracking-tight text-text-primary leading-[1.1] mb-6">
        Reset your password.<br />
        Secure and private.
      </h2>

      <p className="type-lead text-text-secondary mb-12 max-w-md">
        Enter your new password below. Make sure it&apos;s strong and memorable.
      </p>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-ncd-electric/40 to-transparent" aria-hidden="true" />
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle className="size-8 text-success" aria-hidden="true" />
      </div>
      <h1 className="type-h1 font-medium mb-2">Password Updated</h1>
      <p className="type-body text-text-secondary mb-8 max-w-sm mx-auto">
        Your password has been changed. Redirecting to the app…
      </p>
    </div>
  );

  const renderInvalidLink = () => (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
      </div>
      <h1 className="type-h1 font-medium mb-2">Invalid Reset Link</h1>
      <p className="type-body text-text-secondary mb-8 max-w-sm mx-auto">
        This password reset link is invalid or has expired. Please request a new one from the login page.
      </p>
      <Button variant="secondary" onClick={() => router.push("/login")} className="w-full max-w-xs mx-auto">
        Go to Login
      </Button>
    </div>
  );

  const renderResetForm = () => (
    <form onSubmit={handleUpdatePassword} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="type-h4 font-medium tracking-tight">NCD</span>
        <h1 className="type-h1 font-medium mt-4">Set New Password</h1>
        <p className="type-body text-text-secondary mt-2">Enter your new password below.</p>
      </div>

      <PasswordInput
        id="new-password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        disabled={loading}
        autoComplete="new-password"
        required
      />

      <PasswordInput
        id="confirm-password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        disabled={loading}
        autoComplete="new-password"
        required
        className="mt-4"
      />

      {error && <AuthError message={error} />}

      <Button type="submit" disabled={loading} className="mt-6 w-full h-11">
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Update Password"}
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-ncd-electric hover:underline font-medium"
        >
          Back to login
        </button>
      </p>
    </form>
  );

  if (success) {
    return <AuthShell brandSection={brandSection}>{renderSuccess()}</AuthShell>;
  }

  if (!codeExchanged && !loading) {
    return <AuthShell brandSection={brandSection}>{renderInvalidLink()}</AuthShell>;
  }

  return <AuthShell brandSection={brandSection}>{renderResetForm()}</AuthShell>;
}