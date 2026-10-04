// src/lib/auth.ts
"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/database.types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated" | "error";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  status: AuthStatus;
  loading: boolean; // Deprecated: use status instead
  /** True from the moment Logout is pressed until the page navigates away. Route guards must not redirect during this. */
  isSigningOut: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isTreasurer: boolean;
  isMember: boolean;
  needsOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Use useMemo to create supabase client only once
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as Profile;
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;
    let initialSessionResolved = false;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        initialSessionResolved = true;
        
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
            setStatus("authenticated");
          }
        } else {
          setUser(null);
          setProfile(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setStatus("error");
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // Skip the initial session event if we already resolved it
      if (event === "INITIAL_SESSION" && initialSessionResolved) {
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        if (mounted) {
          setProfile(profileData);
          setStatus("authenticated");
        }
      } else {
        setUser(null);
        setProfile(null);
        setStatus("unauthenticated");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    // Clear local auth state, then do a full navigation to the public site.
    // A hard navigation drops every cached workspace component and re-runs middleware
    // with the cleared cookies, so the navbar is guaranteed to be in its logged-out state.
    setUser(null);
    setProfile(null);
    setStatus("unauthenticated");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional hard navigation (see comment above)
    window.location.assign("/");
  }, [supabase]);

  const role = profile?.role ?? "member";
  const needsOnboarding = profile ? !profile.onboarding_completed : true;

  // Backward compatibility: loading is true when status is checking
  const loading = status === "checking";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        status,
        loading,
        isSigningOut,
        signOut,
        refreshProfile,
        isAdmin: role === "admin",
        isTreasurer: role === "treasurer",
        isMember: role === "member",
        needsOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}