"use client";

import { Mail, Award, Calendar, Settings, LogOut } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
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

  const roleLabels: Record<string, string> = {
    member: "Member",
    admin: "Admin",
    treasurer: "Treasurer",
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/app/dashboard" },
        { label: "Profile", href: "/app/profile" }
      ]} />
      <PageHeader title="Profile" description="Manage your account and preferences." className="mt-8" />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={profile.full_name ?? user.email ?? "User"} className="h-24 w-24 mb-4" />
            <h2 className="type-h3 font-medium">{profile.full_name ?? "Unnamed User"}</h2>
            <p className="type-small text-text-muted mt-1">{user.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-ncd-surface/50 px-3 py-1 type-caption font-medium text-text-secondary">
              <Award className="size-3" />
              {roleLabels[profile.role] ?? profile.role}
            </span>
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
          </div>

          <Button variant="secondary" onClick={handleSignOut} className="mt-6 w-full flex items-center justify-center gap-2">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </Card>

        {/* Account Info Card */}
        <Card className="md:col-span-2 p-6">
          <h3 className="type-h4 font-medium mb-4">Account Information</h3>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="type-caption text-text-muted">User ID</dt>
              <dd className="type-small font-mono text-text-primary break-all">{user.id}</dd>
            </div>
            <div>
              <dt className="type-caption text-text-muted">Role</dt>
              <dd className="type-small font-medium text-text-primary">{roleLabels[profile.role] ?? profile.role}</dd>
            </div>
            <div>
              <dt className="type-caption text-text-muted">Email Verified</dt>
              <dd className="type-small text-text-secondary">{user.email_confirmed_at ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="type-caption text-text-muted">Last Sign In</dt>
              <dd className="type-small text-text-secondary">{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Never"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="type-caption text-text-muted">Full Name</dt>
              <dd className="type-body text-text-primary">{profile.full_name ?? "Not set"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="type-caption text-text-muted">Avatar URL</dt>
              <dd className="type-small text-text-secondary break-all">{profile.avatar_url ?? "Not set"}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </Container>
  );
}