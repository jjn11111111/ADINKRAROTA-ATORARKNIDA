import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  SPIN_CYCLE_MEMBER_COOKIE,
  accessFromMemberCookie,
} from "../../../lib/access-control";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const LUNAR_PHASES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

const FOCUS_PROMPTS = {
  release: "Name what is complete, thank it, and let the lesson move into the past.",
  renew: "Choose one small action that proves the next cycle has already begun.",
  integrate: "Bridge the old pattern and the new practice with one visible ritual.",
} as const;

function getDayOfYear(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / 86_400_000);
}

function buildEphemeris(focus: keyof typeof FOCUS_PROMPTS) {
  const now = new Date();
  const dayOfYear = getDayOfYear(now);
  const lunarAge = ((dayOfYear * 0.984_352_966) % 29.530_588_67 + 29.530_588_67) % 29.530_588_67;
  const phaseIndex = Math.floor((lunarAge / 29.530_588_67) * LUNAR_PHASES.length) % LUNAR_PHASES.length;
  const solarIndex = Math.floor(((dayOfYear - 80 + 365) % 365) / (365 / ZODIAC_SIGNS.length));

  return {
    generatedAt: now.toISOString(),
    focus,
    solarGate: ZODIAC_SIGNS[solarIndex],
    lunarPhase: LUNAR_PHASES[phaseIndex],
    cycleDay: dayOfYear,
    prompt: FOCUS_PROMPTS[focus],
  };
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const memberCookie = cookieStore.get(SPIN_CYCLE_MEMBER_COOKIE)?.value;
  const access = accessFromMemberCookie(memberCookie);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "membership_required",
        message: "Spin Cycle ephemeris is available to active members.",
      },
      { status: 401 },
    );
  }

  const focus = request.nextUrl.searchParams.get("focus");
  if (focus !== "release" && focus !== "renew" && focus !== "integrate") {
    return NextResponse.json(
      {
        error: "invalid_focus",
        message: "Focus must be release, renew, or integrate.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(buildEphemeris(focus));
}
