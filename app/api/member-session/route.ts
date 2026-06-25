import { NextRequest, NextResponse } from "next/server";
import {
  ACTIVE_MEMBER_COOKIE_VALUE,
  SPIN_CYCLE_MEMBER_COOKIE,
} from "../../../lib/access-control";

export const dynamic = "force-dynamic";

type MemberSessionRequest = {
  enabled?: boolean;
};

export async function POST(request: NextRequest) {
  if (process.env.ALLOW_MEMBER_SESSION_DEMO === "false") {
    return NextResponse.json(
      { error: "member_preview_disabled" },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as MemberSessionRequest;
  const response = NextResponse.json({ enabled: body.enabled === true });

  if (body.enabled === true) {
    response.cookies.set(SPIN_CYCLE_MEMBER_COOKIE, ACTIVE_MEMBER_COOKIE_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  } else {
    response.cookies.set(SPIN_CYCLE_MEMBER_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
