"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ArrowLeft, Check, Sparkles, Users, FolderKanban, Trophy, BookOpen, X } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { InputWithIcon } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

const interestOptions = [
  { value: "technology", label: "Technology" },
  { value: "ai", label: "AI" },
  { value: "data", label: "Data" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "programming", label: "Programming" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

const tutorialSteps = [
  {
    title: "Your Workspace",
    description: "Understand the NCD dashboard and organization workspace — your home for projects, people, and progress.",
    icon: FolderKanban,
  },
  {
    title: "People",
    description: "Explore members, leadership, and divisions. Find collaborators by skill, interest, and experience.",
    icon: Users,
  },
  {
    title: "Projects",
    description: "Track projects and collaborative work from idea to case study. Build your portfolio.",
    icon: FolderKanban,
  },
  {
    title: "Competitions & Activities",
    description: "Stay updated with NCD activities, announcements, and competition opportunities.",
    icon: Trophy,
  },
  {
    title: "Your Profile",
    description: "Manage your profile, skills, interests, and account information.",
    icon: BookOpen,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, status, refreshProfile } = useAuth();
  const supabase = createClient();

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check if user already completed onboarding
  useEffect(() => {
    if (status === "authenticated" && user) {
      // Check if onboarding was already completed via profile
      // This will be handled by the redirect logic in login
    }
  }, [status, user]);

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

    setShowTutorial(false);
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

      router.push("/app/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const renderTutorial = () => (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-4">
          <Sparkles className="size-3" />
          Step {tutorialStep + 1} of {tutorialSteps.length}
        </span>
        <h1 className="type-h1 font-medium mt-4">{tutorialSteps[tutorialStep].title}</h1>
        <p className="type-body text-text-secondary mt-2">{tutorialSteps[tutorialStep].description}</p>
      </div>

      <div className="mb-8">
        <div className="relative h-48 w-full rounded-lg bg-ncd-surface/50 border border-border flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint text-ncd-electric">
            {(() => {
              const Icon = tutorialSteps[tutorialStep].icon;
              return <Icon className="size-8" aria-hidden="true" />;
            })()}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {tutorialSteps.map((_, index) => (
            <div key={index} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  index <= tutorialStep ? "bg-ncd-electric" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="type-caption text-text-muted text-center">{tutorialStep + 1} / {tutorialSteps.length}</p>
      </div>

      <div className="flex gap-3">
        {tutorialStep > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setTutorialStep((prev) => prev - 1)}
            disabled={loading}
            className="flex-1"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={() => {
            if (tutorialStep < tutorialSteps.length - 1) {
              setTutorialStep((prev) => prev + 1);
            } else {
              setShowTutorial(false);
            }
          }}
          disabled={loading}
          className="flex-1"
        >
          {tutorialStep < tutorialSteps.length - 1 ? (
            <>
              Next
              <ArrowRight className="size-4 ml-2" />
            </>
          ) : (
            "Get Started"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowTutorial(false)}
          disabled={loading}
          className="px-3"
        >
          <X className="size-4" />
          <span className="sr-only">Skip tutorial</span>
        </Button>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <form onSubmit={handleProfileSubmit} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-4">
          <Sparkles className="size-3" />
          Profile Setup
        </span>
        <h1 className="type-h1 font-medium mt-4">Tell us about yourself</h1>
        <p className="type-body text-text-secondary mt-2">This helps us personalize your NCD experience.</p>
      </div>

      <InputWithIcon
        id="onboarding-displayName"
        label="Full Name"
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
          placeholder="What brings you to NCD? What are you working on?"
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
        <Button type="button" variant="secondary" onClick={() => setShowTutorial(true)} disabled={loading} className="flex-1">
          <ArrowLeft className="size-4 mr-2" />
          Back to Tutorial
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );

  const renderInterestsStep = () => (
    <form onSubmit={handleInterestsSubmit} className="w-full max-w-[420px] mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-4">
          <Sparkles className="size-3" />
          Interests
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
            className={`relative p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
              interests.includes(option.value)
                ? "border-ncd-electric bg-accent-tint"
                : "border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover"
            }`}
          >
            <span className="type-small font-medium text-text-primary text-center">{option.label}</span>
            {interests.includes(option.value) && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ncd-electric text-text-primary">
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
        <Button type="button" variant="secondary" onClick={() => setShowTutorial(false)} disabled={loading} className="flex-1">
          <ArrowLeft className="size-4 mr-2" />
          Back to Profile
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Complete Setup"}
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  );

  const brandSection = (
    <div className="relative z-10 max-w-lg text-center lg:text-left">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-ncd-surface/50 text-ncd-electric type-caption font-medium mb-8">
        <Sparkles className="size-3" />
        Growth Together.
      </span>

      {showTutorial ? (
        <>
          <h2 className="type-display font-medium tracking-tight text-text-primary leading-[1.1] mb-6">
            Welcome to NCD.<br />
            Let&apos;s get you started.
          </h2>
          <p className="type-lead text-text-secondary mb-12 max-w-md">
            A quick tour to understand your workspace, then we&apos;ll set up your profile.
          </p>
        </>
      ) : (
        <>
          <h2 className="type-display font-medium tracking-tight text-text-primary leading-[1.1] mb-6">
            Set up your profile.<br />
            Almost done.
          </h2>
          <p className="type-lead text-text-secondary mb-12 max-w-md">
            A few details to help us connect you with the right people, projects, and opportunities.
          </p>
        </>
      )}

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-ncd-electric/40 to-transparent" aria-hidden="true" />
    </div>
  );

  if (status === "checking") {
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
      {showTutorial ? (
        renderTutorial()
      ) : displayName === "" ? (
        renderProfileStep()
      ) : (
        renderInterestsStep()
      )}
    </AuthShell>
  );
}