"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Check, Sparkles, Brain, Code, Palette, BarChart, Briefcase, FlaskConical, Globe } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { InputWithIcon } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

const interestOptions = [
  { value: "technology", label: "Technology", icon: Code },
  { value: "ai", label: "AI", icon: Brain },
  { value: "data", label: "Data", icon: BarChart },
  { value: "design", label: "Design", icon: Palette },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "programming", label: "Programming", icon: Code },
  { value: "research", label: "Research", icon: FlaskConical },
  { value: "other", label: "Other", icon: Globe },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"profile" | "interests" | "complete">("profile");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = displayName.trim();
    if (!trimmed) {
      setError("Display name is required.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }

    setStep("interests");
  };

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleInterestsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Update the profile with onboarding data and mark onboarding as completed
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: displayName.trim(),
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update failed:", updateError);
        setError("Failed to save profile. Please try again.");
        setLoading(false);
        return;
      }

      // Try to insert into members table if it exists
      const { error: memberError } = await supabase
        .from("members")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: displayName.trim(),
          is_public: true,
        });

      if (memberError) {
        console.warn("Member upsert failed:", memberError);
      }

      // Refresh the auth context to update onboarding_completed status
      await refreshProfile();

      setStep("complete");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const renderProfileStep = () => (
    <form onSubmit={handleProfileSubmit} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-4">
          <Sparkles className="size-3" />
          Step 1 of 2
        </span>
        <h1 className="type-h1 font-medium mt-4">Tell us about yourself</h1>
        <p className="type-body text-text-secondary mt-2">This helps us personalize your NCD experience.</p>
      </div>

      <InputWithIcon
        id="onboarding-displayName"
        label="Display Name"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="John Doe"
        icon={<Sparkles className="size-4" />}
        disabled={loading}
        autoComplete="name"
        required
      />

      <div className="mt-4">
        <label htmlFor="onboarding-bio" className="type-small font-medium text-text-primary block mb-2">
          Short Bio (optional)
        </label>
        <textarea
          id="onboarding-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="What brings you to NCD?"
          className="h-24 w-full rounded-md border border-text-muted bg-ncd-elevated px-3 py-2 type-small text-text-primary placeholder:text-text-muted resize-none focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20 disabled:text-text-disabled"
          disabled={loading}
          maxLength={300}
        />
        <p className="mt-1 type-caption text-text-muted text-right">{bio.length}/300</p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-danger" role="alert">
          <span className="size-4 flex-shrink-0">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );

  const renderInterestsStep = () => (
    <form onSubmit={handleInterestsSubmit} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-4">
          <Sparkles className="size-3" />
          Step 2 of 2
        </span>
        <h1 className="type-h1 font-medium mt-4">What are you interested in?</h1>
        <p className="type-body text-text-secondary mt-2">Select all that apply. You can change this later.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {interestOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleInterest(option.value)}
            className={`relative p-4 rounded-lg border transition-all duration-200 flex items-center gap-3 ${
              interests.includes(option.value)
                ? "border-ncd-electric bg-accent-tint"
                : "border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover"
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
              interests.includes(option.value)
                ? "bg-ncd-electric text-text-primary"
                : "bg-accent-tint text-ncd-electric"
            }`}>
              <option.icon className="size-5" aria-hidden="true" />
            </div>
            <span className="type-small font-medium text-text-primary">{option.label}</span>
            {interests.includes(option.value) && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-ncd-electric text-text-primary">
                <Check className="size-3" />
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-danger" role="alert">
          <span className="size-4 flex-shrink-0">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="secondary" onClick={() => setStep("profile")} disabled={loading} className="flex-1">
          Back
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Complete setup"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );

  const renderComplete = () => (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <Sparkles className="size-8 text-success" aria-hidden="true" />
      </div>
      <h1 className="type-h1 font-medium mb-2">Welcome to NCD!</h1>
      <p className="type-body text-text-secondary mb-8 max-w-sm mx-auto">
        Your profile is ready. Start exploring projects, competitions, and the community.
      </p>
      <Button onClick={() => router.push("/app/dashboard")} className="w-full max-w-xs mx-auto">
        Enter NCD
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );

  const brandSection = (
    <div className="relative z-10 max-w-lg text-center lg:text-left">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-8">
        <Sparkles className="size-3" />
        Growth Together.
      </span>

      <h2 className="type-display font-medium tracking-tight text-text-primary leading-[1.1] mb-6">
        Welcome to NCD.<br />
        Let&apos;s set up your profile.
      </h2>

      <p className="type-lead text-text-secondary mb-12 max-w-md">
        A few quick questions to help us connect you with the right people, projects, and opportunities.
      </p>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-ncd-electric/40 to-transparent" aria-hidden="true" />
    </div>
  );

  if (authLoading) {
    return (
      <AuthShell brandSection={brandSection}>
        <div className="w-full max-w-[420px] mx-auto text-center py-12">
          <Loader2 className="size-8 animate-spin mx-auto text-ncd-electric" />
          <p className="mt-4 type-body text-text-secondary">Loading...</p>
        </div>
      </AuthShell>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <AuthShell brandSection={brandSection}>
      {step === "profile" ? renderProfileStep() : step === "interests" ? renderInterestsStep() : renderComplete()}
    </AuthShell>
  );
}