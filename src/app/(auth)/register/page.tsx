"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, FolderKanban, Trophy, BookOpen, Calendar, Sparkles, Mail, Lock, User, CheckCircle } from "lucide-react";
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



export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"register" | "success" | "onboarding">("register");
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "fullName": {
        const trimmed = value.trim();
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 2) return "Full name must be at least 2 characters.";
        return null;
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Please enter a valid email address.";
        return null;
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        // Check for at least one uppercase, one lowercase, one number
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
        return null;
      }
      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== password) return "Passwords do not match.";
        return null;
      }
      default:
        return null;
    }
  };

  const handleBlur = (name: string, value: string) => {
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err || "" }));
  };

  const handleChange = (name: string, value: string) => {
    // Clear error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Update state
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const errors: Record<string, string> = {};
    const fullNameErr = validateField("fullName", fullName);
    const emailErr = validateField("email", email);
    const passwordErr = validateField("password", password);
    const confirmErr = validateField("confirmPassword", confirmPassword);

    if (fullNameErr) errors.fullName = fullNameErr;
    if (emailErr) errors.email = emailErr;
    if (passwordErr) errors.password = passwordErr;
    if (confirmErr) errors.confirmPassword = confirmErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          setError("An account with this email already exists. Try signing in instead.");
        } else {
          setError("Unable to create your account. Please try again.");
        }
        console.error("Registration error:", signUpError);
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        setEmailConfirmed(true);
        setStep("success");
      } else if (data.user && data.session) {
        // No email confirmation required - user is signed in
        // Redirect to onboarding (mandatory for new users)
        router.push("/onboarding");
        router.refresh();
      } else {
        // Unexpected state
        setError("Registration completed but session not established. Please try signing in.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Registration exception:", err);
      setError("An unexpected error occurred. Please try again.");
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
        Create your account.<br />
        Join NCD and grow together.
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

  const renderSuccess = () => (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle className="size-8 text-success" aria-hidden="true" />
      </div>
      <h1 className="type-h1 font-medium mb-2">
        {emailConfirmed ? "Check your email" : "Account created"}
      </h1>
      <p className="type-body text-text-secondary mb-8 max-w-sm mx-auto">
        {emailConfirmed
          ? "We sent a confirmation link to your email address. Please check your inbox and click the link to verify your account."
          : "Your account has been created successfully."}
      </p>
      <div className="flex flex-col gap-3">
        {emailConfirmed && (
          <Button variant="secondary" onClick={() => router.push("/login")} className="w-full">
            Back to login
          </Button>
        )}
        {!emailConfirmed && (
          <Button onClick={() => router.push("/onboarding")} className="w-full">
            Continue to onboarding
          </Button>
        )}
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="type-h4 font-medium tracking-tight">NCD</span>
        <h1 className="type-h1 font-medium mt-4">Create your account</h1>
        <p className="type-body text-text-secondary mt-2">Join NCD and grow together.</p>
      </div>

      <InputWithIcon
        id="register-fullName"
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        onBlur={(e) => handleBlur("fullName", e.target.value)}
        placeholder="John Doe"
        icon={<User className="size-4" />}
        disabled={loading}
        autoComplete="name"
        required
        error={fieldErrors.fullName}
      />

      <InputWithIcon
        id="register-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={(e) => handleBlur("email", e.target.value)}
        placeholder="you@ncd.id"
        icon={<Mail className="size-4" />}
        disabled={loading}
        autoComplete="email"
        required
        error={fieldErrors.email}
        className="mt-4"
      />

      <PasswordInput
        id="register-password"
        label="Password"
        value={password}
        onChange={(e) => handleChange("password", e.target.value)}
        onBlur={(e) => handleBlur("password", e.target.value)}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        disabled={loading}
        autoComplete="new-password"
        required
        error={fieldErrors.password}
        className="mt-4"
      />

      <PasswordInput
        id="register-confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        disabled={loading}
        autoComplete="new-password"
        required
        error={fieldErrors.confirmPassword}
        className="mt-4"
      />

      {error && <AuthError message={error} />}

      <Button type="submit" disabled={loading} className="mt-6 w-full h-11">
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </Button>

      <p className="mt-4 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-ncd-electric hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </form>
  );

  return (
    <AuthShell brandSection={brandSection}>
      {step === "success" ? renderSuccess() : renderRegisterForm()}
    </AuthShell>
  );
}