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

    const [learners, awarded, byTopic] = await Promise.all([
      User.countDocuments({}),
      User.aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$xp" } } },
      ]),
      // "Explored" = how many distinct learners have actually opened each
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
      ]),
    ]);

    // Attach display fields, and keep only slugs that exist in the catalogue.
    const allTopics = byTopic
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

    const topTopics = allTopics.slice(0, 8);
    const maxExplorers = topTopics[0]?.explorers ?? 0;

    // Per-exhibit counts for every exhibit that has been opened. The UI reads
    // this to show real numbers on cards and the exhibit page, and treats a
    // missing slug as "no one yet" rather than inventing a figure.
    const explorerCounts = Object.fromEntries(
      allTopics.map((row) => [row.slug, row.explorers])
    );

    return NextResponse.json({
      learners,
      xpAwarded: awarded[0]?.total ?? 0,
      topics: topTopics,
      maxExplorers,
      explorerCounts,
    });
  } catch {
    return NextResponse.json(
      {
        learners: null,
        xpAwarded: null,
        topics: [],
        maxExplorers: 0,
        explorerCounts: {},
        error: "Statistics unavailable.",
      },
      { status: 503 }
    );
  }
}
