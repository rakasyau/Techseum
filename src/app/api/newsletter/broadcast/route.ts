import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { sendEmail, generateWeeklyExhibitNewsletterHtml } from "@/lib/email";
import { TOPICS } from "@/data/topics";

async function executeBroadcast(selectedTopicSlug?: string) {
  // If no specific topic requested, rotate weekly based on calendar week
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const rotatedTopic = TOPICS[weekNumber % TOPICS.length];
  const featuredTopic = (selectedTopicSlug ? TOPICS.find((t) => t.slug === selectedTopicSlug || t.id === selectedTopicSlug) : null) || rotatedTopic;

  // Fetch active subscribers
  let subscribers: { email: string }[] = [];
  try {
    await connectToDatabase();
    subscribers = await Subscriber.find({ active: true }).select("email").lean();
  } catch (err) {
    console.warn("MongoDB connection fallback for broadcast:", (err as Error).message);
    subscribers = [{ email: "explorer@techseum.io" }];
  }

  if (subscribers.length === 0) {
    return {
      success: true,
      message: "No active subscribers found.",
      sentCount: 0,
    };
  }

  const results = [];
  for (const sub of subscribers) {
    const html = generateWeeklyExhibitNewsletterHtml({
      subscriberEmail: sub.email,
      featuredExhibitTitle: featuredTopic.title,
      featuredExhibitDesc: featuredTopic.tagline,
      exhibitSlug: featuredTopic.slug,
    });

    const res = await sendEmail({
      to: sub.email,
      subject: `[Techseum Weekly Exhibit] ${featuredTopic.title}`,
      html,
    });

    results.push({ email: sub.email, ...res });
  }

  return {
    success: true,
    topic: featuredTopic.title,
    totalRecipients: subscribers.length,
    sentCount: results.filter((r) => r.success).length,
    results,
  };
}

// ── Vercel Cron Trigger (GET) ──────────────────────────
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify Vercel Cron secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const report = await executeBroadcast();
    return NextResponse.json(report);
  } catch (err) {
    console.error("Vercel Cron Broadcast error:", err);
    return NextResponse.json({ error: "Failed to run cron broadcast" }, { status: 500 });
  }
}

// ── Manual Admin Trigger (POST) ────────────────────────
export async function POST(req: Request) {
  try {
    const { topicSlug, secretKey } = await req.json().catch(() => ({}));

    // Admin token check
    const adminKey = process.env.ADMIN_BROADCAST_SECRET || "techseum_admin_broadcast_2026";
    if (!secretKey || secretKey !== adminKey) {
      return NextResponse.json({ error: "Unauthorized broadcast request" }, { status: 401 });
    }

    const report = await executeBroadcast(topicSlug);
    return NextResponse.json(report);
  } catch (err) {
    console.error("Manual Broadcast error:", err);
    return NextResponse.json({ error: "Failed to broadcast newsletter" }, { status: 500 });
  }
}

