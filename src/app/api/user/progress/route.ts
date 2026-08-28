import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUserFromCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { xpDelta, completedTopicId, bookmarkTopicId, newBadge } = await req.json();

    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (typeof xpDelta === "number") {
      user.xp += xpDelta;
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    }

    if (completedTopicId && !user.completedTopics.includes(completedTopicId)) {
      user.completedTopics.push(completedTopicId);
      user.xp += 50; // topic completion reward
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    }

    if (bookmarkTopicId) {
      if (user.bookmarks.includes(bookmarkTopicId)) {
        user.bookmarks = user.bookmarks.filter((b) => b !== bookmarkTopicId);
      } else {
        user.bookmarks.push(bookmarkTopicId);
      }
    }

    if (newBadge && !user.badges.some((b) => b.id === newBadge.id)) {
      user.badges.push(newBadge);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        completedTopics: user.completedTopics,
        bookmarks: user.bookmarks,
        badges: user.badges,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Progress sync error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
