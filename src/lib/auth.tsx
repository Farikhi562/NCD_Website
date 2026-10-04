// src/lib/auth.ts
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  const supabase = createClient();

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

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
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
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // State will be updated via onAuthStateChange
  };

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