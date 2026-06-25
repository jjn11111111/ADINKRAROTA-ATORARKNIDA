"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MembershipProfile } from "../lib/access-control";

type ProfileResponse = {
  profile: MembershipProfile;
  allowMemberPreview: boolean;
};

type AuthContextValue = {
  profile: MembershipProfile | null;
  isLoading: boolean;
  allowMemberPreview: boolean;
  refreshProfile: () => Promise<void>;
  enableMemberPreview: () => Promise<void>;
  clearMemberPreview: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function updateMemberPreview(enabled: boolean) {
  const response = await fetch("/api/member-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ enabled }),
  });

  if (!response.ok) {
    throw new Error("Unable to update member session");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<MembershipProfile | null>(null);
  const [allowMemberPreview, setAllowMemberPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load profile");
      }

      const data = (await response.json()) as ProfileResponse;
      setProfile(data.profile);
      setAllowMemberPreview(data.allowMemberPreview);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const enableMemberPreview = useCallback(async () => {
    await updateMemberPreview(true);
    await refreshProfile();
  }, [refreshProfile]);

  const clearMemberPreview = useCallback(async () => {
    await updateMemberPreview(false);
    await refreshProfile();
  }, [refreshProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      isLoading,
      allowMemberPreview,
      refreshProfile,
      enableMemberPreview,
      clearMemberPreview,
    }),
    [allowMemberPreview, clearMemberPreview, enableMemberPreview, isLoading, profile, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthProfile() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuthProfile must be used inside AuthProvider");
  }

  return value;
}
