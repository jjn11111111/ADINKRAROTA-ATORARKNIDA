import { PRODUCTS, type MembershipTier } from "./products";

export const SPIN_CYCLE_MEMBER_COOKIE = "adinkrarota_member";
export const ACTIVE_MEMBER_COOKIE_VALUE = "active";

export type MembershipProfile = {
  id?: string;
  email?: string;
  tier: MembershipTier;
};

export type AccessDecision = {
  allowed: boolean;
  reason: "member" | "public" | "missing_profile";
};

export function createPublicProfile(): MembershipProfile {
  return { tier: "public" };
}

export function createMemberProfile(profile: Partial<MembershipProfile> = {}): MembershipProfile {
  return {
    ...profile,
    tier: "member",
  };
}

export function canAccessSpinCycle(profile: MembershipProfile | null | undefined): AccessDecision {
  if (!profile) {
    return { allowed: false, reason: "missing_profile" };
  }

  if (profile.tier === PRODUCTS.spinCycle.requiredMembership) {
    return { allowed: true, reason: "member" };
  }

  return { allowed: false, reason: "public" };
}

export function profileFromMemberCookie(cookieValue: string | undefined): MembershipProfile {
  return cookieValue === ACTIVE_MEMBER_COOKIE_VALUE ? createMemberProfile() : createPublicProfile();
}

export function accessFromMemberCookie(cookieValue: string | undefined): AccessDecision {
  return canAccessSpinCycle(profileFromMemberCookie(cookieValue));
}
