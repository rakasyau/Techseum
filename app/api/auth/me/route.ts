import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the signed-in user, or { user: null } for an anonymous visitor.
// Anonymous is a normal state here, not a 401, so the client can call this on
// every page load without treating it as an error.
export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch {
    // A database outage should not look like "logged out" with no explanation.
    return NextResponse.json(
      { user: null, error: "Unable to reach the account service." },
      { status: 503 }
    );
  }
}
