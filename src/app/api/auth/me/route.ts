import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
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
    console.error("Auth Me Error:", err);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
