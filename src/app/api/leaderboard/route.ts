import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const dbUsers = await User.find({})
      .sort({ xp: -1 })
      .limit(50)
      .select("name xp streak badges completedTopics")
      .lean();

    const leaders = dbUsers.map((u, i) => {
      const initials = (u.name || "Explorer")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        rank: i + 1,
        name: u.name,
        avatar: initials || "EX",
        categorySpecialty: u.completedTopics?.length ? "Architect" : "Explorer",
        xp: u.xp || 0,
        streak: u.streak || 1,
        badgesCount: u.badges?.length || 0,
        isRealUser: true,
      };
    });

    return NextResponse.json({ success: true, leaders });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Leaderboard fetch error:", err);
    return NextResponse.json({ success: false, leaders: [], error: err.message }, { status: 500 });
  }
}
