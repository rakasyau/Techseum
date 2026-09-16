import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * The leaderboard reads real accounts from MongoDB.
 *
 * It returns aggregates only — username, display name, avatar seed, XP, streak
 * and badge count. Email addresses and per-account progress never leave the
 * server. When there are no accounts yet it returns an empty board and the UI
 * shows an honest empty state instead of invented names.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") === "weekly" ? "weekly" : "all";

  try {
    await connectToDatabase();

    if (range === "weekly") {
      // "Weekly" is genuinely weekly: sum only XP earned in the last 7 days,
      // using the event log rather than a stored snapshot.
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const rows = await User.aggregate<{
        username: string;
        displayName: string;
        avatarSeed: string;
        value: number;
        streak: number;
        badges: number;
      }>([
        { $unwind: { path: "$events", preserveNullAndEmptyArrays: false } },
        { $match: { "events.createdAt": { $gte: since } } },
        {
          $group: {
            _id: "$_id",
            username: { $first: "$username" },
            displayName: { $first: "$displayName" },
            avatarSeed: { $first: "$avatarSeed" },
            value: { $sum: "$events.amount" },
            streak: { $first: { $ifNull: ["$streak.current", 0] } },
            badges: { $first: { $size: { $ifNull: ["$badges", []] } } },
          },
        },
        { $sort: { value: -1 } },
        { $limit: 50 },
      ]);

      return NextResponse.json({ range, entries: rows });
    }

    const docs = await User.find({})
      .sort({ xp: -1 })
      .limit(50)
      .select("username displayName avatarSeed xp streak badges")
      .lean();

    const entries = docs.map((d: Record<string, any>) => ({
      username: d.username,
      displayName: d.displayName,
      avatarSeed: d.avatarSeed ?? "EX",
      value: d.xp ?? 0,
      streak: d.streak?.current ?? 0,
      badges: (d.badges ?? []).length,
    }));

    return NextResponse.json({ range, entries });
  } catch {
    return NextResponse.json(
      { range, entries: [], error: "The leaderboard is unavailable right now." },
      { status: 503 }
    );
  }
}
