import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";

// In-memory fallback if MongoDB connection is not configured in local environment
const inMemorySubscribers = new Set<string>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Try persisting to MongoDB
    try {
      await connectToDatabase();
      const existing = await Subscriber.findOne({ email: cleanEmail });

      if (existing) {
        if (!existing.active) {
          existing.active = true;
          await existing.save();
        }
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to the Techseum weekly newsletter!",
          isExisting: true,
        });
      }

      await Subscriber.create({
        email: cleanEmail,
        active: true,
        source: "footer",
      });

      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to Techseum weekly exhibits!",
      });
    } catch (dbError) {
      console.warn("MongoDB connection fallback for newsletter:", (dbError as Error).message);
      // In-memory fallback
      inMemorySubscribers.add(cleanEmail);
      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to Techseum weekly exhibits! (Local Mode)",
      });
    }
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return NextResponse.json(
      { error: "Failed to process newsletter subscription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const count = await Subscriber.countDocuments({ active: true });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: inMemorySubscribers.size });
  }
}
