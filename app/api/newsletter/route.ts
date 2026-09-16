import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/subscriber";
import {
  addToAudience,
  newsletterConfigured,
  sendWelcomeEmail,
} from "@/lib/resend";
import { firstIssue } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  locale: z.enum(["en", "id"]).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const email = parsed.data.email;
  const locale = parsed.data.locale ?? "en";

  // Persist first: a provider outage must never lose a signup.
  let created = false;
  try {
    await connectToDatabase();
    const existing = await Subscriber.findOne({ email }).lean();
    if (!existing) {
      await Subscriber.create({ email, locale, source: "footer" });
      created = true;
    } else if (existing.unsubscribedAt) {
      await Subscriber.updateOne({ email }, { $set: { unsubscribedAt: null } });
      created = true;
    }
  } catch {
    return NextResponse.json(
      { error: "Could not save your subscription. Please try again." },
      { status: 503 }
    );
  }

  // Then sync to the provider. A failure here is reported, not fatal.
  let audience: "added" | "duplicate" | "skipped" | "failed" = "skipped";
  let welcome: "sent" | "skipped" | "failed" = "skipped";

  if (newsletterConfigured() && created) {
    audience = await addToAudience(email);
    welcome = await sendWelcomeEmail(email);
    if (audience === "added" || welcome === "sent") {
      await Subscriber.updateOne(
        { email },
        { $set: { syncedToProvider: true } }
      ).catch(() => undefined);
    }
  }

  return NextResponse.json({
    ok: true,
    alreadySubscribed: !created,
    provider: { audience, welcome },
  });
}
