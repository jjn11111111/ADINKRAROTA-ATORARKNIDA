import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVE_MEMBER_COOKIE_VALUE,
  accessFromMemberCookie,
  canAccessSpinCycle,
  createMemberProfile,
  createPublicProfile,
} from "../lib/access-control";

test("public profiles cannot access the interactive Spin Cycle workflow", () => {
  assert.deepEqual(canAccessSpinCycle(createPublicProfile()), {
    allowed: false,
    reason: "public",
  });
});

test("missing profiles cannot access the interactive Spin Cycle workflow", () => {
  assert.deepEqual(canAccessSpinCycle(null), {
    allowed: false,
    reason: "missing_profile",
  });
});

test("member profiles can access the interactive Spin Cycle workflow", () => {
  assert.deepEqual(canAccessSpinCycle(createMemberProfile()), {
    allowed: true,
    reason: "member",
  });
});

test("active member cookie unlocks server-side Spin Cycle access", () => {
  assert.deepEqual(accessFromMemberCookie(ACTIVE_MEMBER_COOKIE_VALUE), {
    allowed: true,
    reason: "member",
  });
});
