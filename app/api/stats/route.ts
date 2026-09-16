import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import { TOPICS } from "@/lib/data/topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Public, aggregate-only site statistics.
 *
 * Everything here is counted from real accounts. On a fresh deployment the
 * learner count is zero and "most explored" is empty, and the UI states that
 * plainly instead of inventing numbers.
 */
export async function GET() {
  try {
    await connectToDatabase();

    const [learners, awarded, topTopics] = await Promise.all([
      User.countDocuments({}),
      User.aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$xp" } } },
      ]),
      // "Most explored" = how many distinct learners have actually opened each
      // exhibit. Derived from real progress records, not a seeded counter.
      User.aggregate<{ _id: string; explorers: number }>([
        { $unwind: "$progress" },
        {
          $group: {
            _id: "$progress.topicSlug",
            explorers: { $sum: 1 },
          },
        },
        { $sort: { explorers: -1 } },
        { $limit: 8 },
      ]),
    ]);

    // Attach display fields, and keep only slugs that exist in the catalogue.
    const enriched = topTopics
      .map((row) => {
        const topic = TOPICS.find((t) => t.slug === row._id);
        if (!topic) return null;
        return {
          slug: topic.slug,
          title: topic.title,
          category: topic.category,
          glyph: topic.glyph,
          explorers: row.explorers,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    const maxExplorers = enriched[0]?.explorers ?? 0;

    return NextResponse.json({
      learners,
      xpAwarded: awarded[0]?.total ?? 0,
      topics: enriched,
      maxExplorers,
    });
  } catch {
    return NextResponse.json(
      {
        learners: null,
        xpAwarded: null,
        topics: [],
        maxExplorers: 0,
        error: "Statistics unavailable.",
      },
      { status: 503 }
    );
  }
}
