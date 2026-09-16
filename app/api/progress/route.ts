import { NextResponse } from "next/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { msg, translateValidation } from "@/lib/i18n/api-messages";
import { getCurrentUser } from "@/lib/auth";
import {
  bookmarkSchema,
  challengeAttemptSchema,
  firstIssue,
  preferencesSchema,
  progressSchema,
} from "@/lib/validation";
import {
  recordChallengeAttempt,
  recordLevelRead,
  toggleBookmark,
  updatePreferences,
} from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * A single write endpoint for everything the learner does. Actions are
 * explicit and validated; XP is never sent by the client.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: msg("invalidBody", getRequestLocale(request)) }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: msg("notSignedIn", getRequestLocale(request)) }, { status: 401 });
  }

  const action =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).type
      : undefined;

  try {
    switch (action) {
      case "progress": {
        const parsed = progressSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: firstIssue(parsed.error) },
            { status: 400 }
          );
        }
        const result = await recordLevelRead(
          user.id,
          parsed.data.topicSlug,
          parsed.data.level
        );
        return NextResponse.json({
          user: result.user,
          awarded: result.awarded,
        });
      }

      case "challenge": {
        const parsed = challengeAttemptSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: firstIssue(parsed.error) },
            { status: 400 }
          );
        }
        const result = await recordChallengeAttempt(
          user.id,
          parsed.data.challengeId,
          parsed.data.correct
        );
        return NextResponse.json({
          user: result.user,
          awarded: result.awarded,
        });
      }

      case "bookmark": {
        const parsed = bookmarkSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: firstIssue(parsed.error) },
            { status: 400 }
          );
        }
        const updated = await toggleBookmark(
          user.id,
          parsed.data.topicSlug,
          parsed.data.bookmarked
        );
        return NextResponse.json({ user: updated });
      }

      case "preferences": {
        const parsed = preferencesSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: firstIssue(parsed.error) },
            { status: 400 }
          );
        }
        const updated = await updatePreferences(user.id, parsed.data);
        return NextResponse.json({ user: updated });
      }

      default:
        return NextResponse.json(
          { error: msg("unknownAction", getRequestLocale(request)) },
          { status: 400 }
        );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : msg("saveProgress", getRequestLocale(request));
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
