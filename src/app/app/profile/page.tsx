"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Award,
  Calendar,
  Settings,
  LogOut,
  Users,
  Building2,
  Camera,
  Save,
  X,
  Edit2,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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

export default function ProfilePage() {
  const { user, profile, status, signOut, refreshProfile } = useAuth();
  const supabase = createClient();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state - initialize from profile (NPM removed)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    interests: profile?.interests || [],
  });

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Track if form has been initialized from profile
  const initializedRef = useRef(false);

  // Load profile data into form when profile changes (only once on mount)
  useEffect(() => {
    if (profile && !initializedRef.current) {
      initializedRef.current = true;
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  // Load member data for organizational info
  const [memberData, setMemberData] = useState<{
    team: string | null;
    division: string | null;
    org_role: string | null;
  } | null>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("members")
        .select("team, division, org_role")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setMemberData(data);
        });
    }
  }, [user?.id, supabase]);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleEditMode = () => {
    if (!editMode) {
      // Entering edit mode - ensure form is synced
      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          bio: profile.bio || "",
          interests: profile.interests || [],
        });
        setAvatarPreview(profile.avatar_url);
      }
      setEditMode(true);
    } else {
      // Canceling edit mode - reset form
      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          bio: profile.bio || "",
          interests: profile.interests || [],
        });
        setAvatarPreview(profile.avatar_url);
        setAvatarFile(null);
      }
      setEditMode(false);
      setError(null);
      setSuccess(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleInterestToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    if (!user || !profile) {
      setError("Unable to save: user session not found.");
      setSaving(false);
      return;
    }

    try {
      // Upload avatar if changed
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
            contentType: avatarFile.type,
          });

        if (uploadError) {
          console.error("Avatar upload failed:", uploadError);
          throw new Error("Failed to upload avatar. Please try again.");
        }

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim() || null,
          bio: formData.bio.trim() || null,
          interests: formData.interests.length > 0 ? formData.interests : null,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update failed:", updateError);
        throw new Error("Failed to save profile. Please try again.");
      }

      // Directory rows are created only by approving an application
      // (migration 004); a profile edit refreshes the row when one exists and
      // never inserts a new member. The address stays on the profile, not on
      // the publicly readable directory row.
      const { error: memberError } = await supabase
        .from("members")
        .update({
          full_name: formData.full_name.trim() || null,
          interests: formData.interests.length > 0 ? formData.interests : null,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (memberError) {
        console.warn("Member directory update skipped:", memberError.message);
      }

      // Refresh auth context
      await refreshProfile();

      setSuccess(true);
      setEditMode(false);
      setAvatarFile(null);
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const roleLabels: Record<string, string> = {
    member: "Member",
    admin: "Admin",
    treasurer: "Treasurer",
  };

  if (status === "checking") {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Profile", href: "/app/profile" }
        ]} />
        <PageHeader title="Profile" description="Loading..." className="mt-8" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6"><div className="skeleton h-8 w-32" /><div className="mt-4 skeleton h-12 w-48" /></Card>
          <Card className="p-6"><div className="skeleton h-8 w-32" /><div className="mt-4 skeleton h-12 w-48" /></Card>
        </div>
      </Container>
    );
  }

  if (!user || !profile) {
    return (
      <Container className="py-8 md:py-12">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/app/dashboard" },
          { label: "Profile", href: "/app/profile" }
        ]} />
        <PageHeader title="Profile" description="Unable to load profile." className="mt-8" />
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Profile", href: "/app/profile" }
      ]} />
      <PageHeader
        title="Profile"
        description="Manage your account and preferences."
        className="mt-8"
        actions={
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <Button variant="secondary" onClick={handleSave} disabled={saving}>
                  <Save className="size-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" onClick={toggleEditMode} disabled={saving}>
                  <X className="size-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={toggleEditMode}>
                <Edit2 className="size-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <div className="mt-4 mb-6 p-4 rounded-lg border border-danger/50 bg-danger/10 flex items-center gap-3 text-sm text-danger" role="alert">
          <span className="size-5 flex-shrink-0">!</span>
          <span>{error}</span>
        </div>
      )}

      {success && !editMode && (
        <div className="mt-4 mb-6 p-4 rounded-lg border border-success/50 bg-success/10 flex items-center gap-3 text-sm text-success" role="status">
          <span className="size-5 flex-shrink-0">✓</span>
          <span>Profile updated successfully.</span>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar with upload in edit mode */}
            <div className="relative mb-4">
              <Avatar
                name={formData.full_name || profile.full_name || user.email || "User"}
                src={avatarPreview}
                className="h-24 w-24"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ncd-electric text-text-primary shadow-lg hover:bg-ncd-violet transition-colors">
                    <Camera className="size-5" />
                  </div>
                </label>
              )}
            </div>

            <h2 className="type-h3 font-medium">{formData.full_name || profile.full_name || "Unnamed User"}</h2>
            <p className="type-small text-text-muted mt-1">{user.email}</p>

            {/* Role badge - read-only - show organizational role from members table */}
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-ncd-surface/50 px-3 py-1 type-caption font-medium text-text-secondary">
              <Award className="size-3" />
              {memberData?.org_role ?? roleLabels[profile.role] ?? profile.role}
            </span>

            {/* Organization info from members table - read-only */}
            {memberData && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Badge tone="neutral" className="text-xs">{memberData.team || "Not Assigned"}</Badge>
                <Badge tone="info" className="text-xs">{memberData.division || "Not Assigned"}</Badge>
              </div>
            )}

            {editMode && (
              <p className="mt-2 type-caption text-text-muted">
                Your organizational role, division, and team are managed by NCD leadership.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-text-muted" />
              <span className="text-text-secondary">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 text-text-muted" />
              <span className="text-text-secondary">Joined {formatDate(user.created_at)}</span>
            </div>
            {profile.updated_at && (
              <div className="flex items-center gap-3 text-sm">
                <Settings className="size-4 text-text-muted" />
                <span className="text-text-secondary">Updated {formatDate(profile.updated_at)}</span>
              </div>
            )}
            {memberData && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="size-4 text-text-muted" />
                  <span className="text-text-secondary">Team: {memberData.team || "Not Assigned"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="size-4 text-text-muted" />
                  <span className="text-text-secondary">Division: {memberData.division || "Not Assigned"}</span>
                </div>
              </>
            )}
          </div>

          {!editMode && (
            <Button variant="secondary" onClick={handleSignOut} className="mt-6 w-full flex items-center justify-center gap-2">
              <LogOut className="size-4" />
              Sign out
            </Button>
          )}
        </Card>

        {/* Editable Profile Info Card */}
        <Card className="md:col-span-2 p-6">
          <h3 className="type-h4 font-medium mb-4">Personal Information</h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="profile-full_name" className="type-small font-medium text-text-primary block mb-2">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="profile-full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="w-full rounded-md border border-border bg-ncd-elevated px-3 py-2 type-small text-text-primary placeholder:text-text-muted focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20 disabled:bg-ncd-surface"
                disabled={!editMode}
                required
                autoComplete="name"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="profile-bio" className="type-small font-medium text-text-primary block mb-2">
                Bio (optional)
              </label>
              <textarea
                id="profile-bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                className="h-24 w-full rounded-md border border-border bg-ncd-elevated px-3 py-2 type-small text-text-primary placeholder:text-text-muted resize-none focus:border-ncd-electric focus:outline-none focus:ring-2 focus:ring-ncd-electric/20 disabled:bg-ncd-surface"
                disabled={!editMode}
                maxLength={500}
              />
              <p className="mt-1 type-caption text-text-muted text-right">{formData.bio.length}/500</p>
            </div>

            {/* Interests */}
            <div>
              <label className="type-small font-medium text-text-primary block mb-2">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInterestToggle(option.value)}
                    disabled={!editMode}
                    className={`relative p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                      formData.interests.includes(option.value)
                        ? "border-ncd-electric bg-accent-tint"
                        : "border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover"
                    } opacity-${editMode ? 100 : 60}`}
                  >
                    <span className="type-small font-medium text-text-primary text-center">{option.label}</span>
                    {formData.interests.includes(option.value) && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ncd-electric text-text-primary">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Read-only organizational fields notice */}
            {!editMode && memberData && (
              <div className="pt-4 border-t border-border">
                <h4 className="type-small font-medium text-text-primary mb-3">Organization Information</h4>
                <dl className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <dt className="type-caption text-text-muted">Team</dt>
                    <dd className="type-small font-medium text-text-primary">{memberData.team || "Not Assigned"}</dd>
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Division</dt>
                    <dd className="type-small font-medium text-text-primary">{memberData.division || "Not Assigned"}</dd>
                  </div>
                  <div>
                    <dt className="type-caption text-text-muted">Role</dt>
                    <dd className="type-small font-medium text-text-primary">{memberData.org_role || "Not Assigned"}</dd>
                  </div>
                </dl>
                <p className="mt-3 type-caption text-text-muted">
                  These fields are managed by NCD leadership. Contact your Division Lead for changes.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}