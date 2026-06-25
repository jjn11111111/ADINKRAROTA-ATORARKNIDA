import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SPIN_CYCLE_MEMBER_COOKIE,
  profileFromMemberCookie,
} from "../../../lib/access-control";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const memberCookie = cookieStore.get(SPIN_CYCLE_MEMBER_COOKIE)?.value;

  return NextResponse.json({
    profile: profileFromMemberCookie(memberCookie),
    allowMemberPreview: process.env.ALLOW_MEMBER_SESSION_DEMO !== "false",
  });
}
