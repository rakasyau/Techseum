import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { sendEmail, generateWeeklyExhibitNewsletterHtml } from "@/lib/email";
import { TOPICS } from "@/data/topics";

export async function POST(req: Request) {
  try {
    const { topicSlug, secretKey } = await req.json().catch(() => ({}));

    // Optional admin token check
    const adminKey = process.env.ADMIN_BROADCAST_SECRET || "techseum_admin_broadcast_2026";
    if (secretKey && secretKey !== adminKey) {
      return NextResponse.json({ error: "Unauthorized broadcast request" }, { status: 401 });
    }

    // Pick topic to feature
    const featuredTopic = (topicSlug ? TOPICS.find((t) => t.slug === topicSlug || t.id === topicSlug) : null) || TOPICS[0];

    // Fetch active subscribers
    let subscribers: { email: string }[] = [];
    try {
      await connectToDatabase();
      subscribers = await Subscriber.find({ active: true }).select("email").lean();
    } catch {
      subscribers = [{ email: "explorer@techseum.io" }];
    }

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active subscribers found.",
        sentCount: 0,
      });
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
        subject: `[Techseum Eksibit Baru] ${featuredTopic.title}`,
        html,
      });

      results.push({ email: sub.email, ...res });
    }

    return NextResponse.json({
      success: true,
      topic: featuredTopic.title,
      totalRecipients: subscribers.length,
      sentCount: results.filter((r) => r.success).length,
      results,
    });
  } catch (err) {
    console.error("Broadcast newsletter error:", err);
    return NextResponse.json({ error: "Failed to broadcast newsletter" }, { status: 500 });
  }
}
