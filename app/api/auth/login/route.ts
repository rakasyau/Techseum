import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import { startSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { loginSchema, firstIssue } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const identifier = parsed.data.identifier.toLowerCase().trim();

  let doc: Record<string, any> | null = null;
  try {
    await connectToDatabase();
    doc = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+passwordHash")
      .lean();
  } catch {
    return NextResponse.json(
      { error: "The service is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  // Always perform a hash comparison, even with no matching user, so the
  // response time does not reveal whether an account exists.
  const DUMMY_HASH =
    "$2a$12$SXfQ1T5Yx5n1BfLdQ0VgQeWq0FjJQ0Z8c1kM2n4x4p9u5t7y1K0Cu";

  let ok = false;
  if (doc && typeof doc.passwordHash === "string") {
    ok = await verifyPassword(parsed.data.password, doc.passwordHash);
  } else {
    await verifyPassword(parsed.data.password, DUMMY_HASH);
  }

  if (!doc || !ok) {
    return NextResponse.json(
      { error: "Those credentials do not match an account." },
      { status: 401 }
    );
  }

  await User.updateOne({ _id: doc._id }, { $set: { lastSeenAt: new Date() } });
  await startSession(String(doc._id), String(doc.username));
  return NextResponse.json({ ok: true });
}
