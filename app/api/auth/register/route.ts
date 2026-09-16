import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, toPublicUser } from "@/lib/models/user";
import { hashPassword, startSession } from "@/lib/auth";
import { registerSchema, firstIssue } from "@/lib/validation";
import { validatePassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const { email, username, displayName, password } = parsed.data;

  const passwordIssue = validatePassword(password);
  if (passwordIssue) {
    return NextResponse.json({ error: passwordIssue.message }, { status: 400 });
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { error: "The service is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  const existing = await User.findOne({
    $or: [{ email }, { username }],
  })
    .select("email username")
    .lean();

  if (existing) {
    const field = existing.email === email ? "email address" : "username";
    return NextResponse.json(
      { error: `That ${field} is already registered.` },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const avatarSeed = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || username.slice(0, 2).toUpperCase();

  const created = await User.create({
    email,
    username,
    displayName,
    passwordHash,
    avatarSeed,
    preferences: { language: "en", theme: "light", defaultLevel: 2, reducedMotion: false },
  });

  await startSession(String(created._id), created.username);
  return NextResponse.json(
    { user: toPublicUser(created.toObject()) },
    { status: 201 }
  );
}
