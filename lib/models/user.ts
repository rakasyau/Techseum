import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/*
 * The single source of truth for a user's account and learning state.
 *
 * XP is stored as a raw total; display level is derived from it (see
 * lib/xp.ts) so a formula change never requires a migration. Every award is
 * recorded in `events` so the same action cannot be paid twice and so the
 * profile history is real rather than seeded.
 */

const challengeResultSchema = new Schema(
  {
    challengeId: { type: String, required: true },
    correct: { type: Boolean, default: false },
    attempts: { type: Number, default: 0, min: 0 },
    awardedXp: { type: Number, default: 0, min: 0 },
    attemptedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const topicProgressSchema = new Schema(
  {
    topicSlug: { type: String, required: true },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    levelReached: { type: Number, default: 1, min: 1, max: 4 },
    // Levels whose reading credit has already been paid out.
    completedLevels: { type: [Number], default: [] },
    completedBonusPaid: { type: Boolean, default: false },
    challengeResults: { type: [challengeResultSchema], default: [] },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const xpEventSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["level-read", "challenge", "topic-complete", "daily"],
      required: true,
    },
    amount: { type: Number, required: true },
    // Dedupe key, e.g. "level:cpu:2" or "challenge:cpu-order".
    key: { type: String, required: true },
    topicSlug: { type: String },
    label: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarSeed: { type: String, default: "EX" },
    bio: { type: String, default: "", maxlength: 280 },

    xp: { type: Number, default: 0, min: 0 },
    streak: {
      current: { type: Number, default: 0, min: 0 },
      longest: { type: Number, default: 0, min: 0 },
      lastActiveDate: { type: Date, default: null },
    },

    badges: { type: [String], default: [] },
    bookmarks: { type: [String], default: [] },
    progress: { type: [topicProgressSchema], default: [] },

    preferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "light" },
      language: { type: String, enum: ["en", "id"], default: "en" },
      defaultLevel: { type: Number, min: 1, max: 4, default: 2 },
      reducedMotion: { type: Boolean, default: false },
    },

    events: { type: [xpEventSchema], default: [] },
    lastSeenAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    // Never leak the password hash through a stray .toJSON() call.
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// A user's rank query is "sort everyone by xp" — index it.
userSchema.index({ xp: -1 });

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) || model<UserDoc>("User", userSchema);

// Shape returned to the client. Defined here so the API and the UI agree.
export interface PublicUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarSeed: string;
  bio: string;
  xp: number;
  streak: { current: number; longest: number; lastActiveDate: string | null };
  badges: string[];
  bookmarks: string[];
  preferences: {
    theme: "light" | "dark" | "system";
    language: "en" | "id";
    defaultLevel: number;
    reducedMotion: boolean;
  };
  progress: {
    topicSlug: string;
    status: "not-started" | "in-progress" | "completed";
    levelReached: number;
    completedLevels: number[];
    challengeResults: {
      challengeId: string;
      correct: boolean;
      attempts: number;
      attemptedAt: string;
    }[];
  }[];
  events: {
    kind: string;
    amount: number;
    label?: string;
    topicSlug?: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export function toPublicUser(doc: Record<string, any>): PublicUser {
  return {
    id: String(doc._id),
    email: doc.email,
    username: doc.username,
    displayName: doc.displayName,
    avatarSeed: doc.avatarSeed ?? "EX",
    bio: doc.bio ?? "",
    xp: doc.xp ?? 0,
    streak: {
      current: doc.streak?.current ?? 0,
      longest: doc.streak?.longest ?? 0,
      lastActiveDate: doc.streak?.lastActiveDate
        ? new Date(doc.streak.lastActiveDate).toISOString()
        : null,
    },
    badges: doc.badges ?? [],
    bookmarks: doc.bookmarks ?? [],
    preferences: {
      theme: doc.preferences?.theme ?? "light",
      language: doc.preferences?.language ?? "en",
      defaultLevel: doc.preferences?.defaultLevel ?? 2,
      reducedMotion: doc.preferences?.reducedMotion ?? false,
    },
    progress: (doc.progress ?? []).map((p: Record<string, any>) => ({
      topicSlug: p.topicSlug,
      status: p.status,
      levelReached: p.levelReached,
      completedLevels: p.completedLevels ?? [],
      challengeResults: (p.challengeResults ?? []).map(
        (c: Record<string, any>) => ({
          challengeId: c.challengeId,
          correct: Boolean(c.correct),
          attempts: c.attempts ?? 0,
          attemptedAt: new Date(c.attemptedAt).toISOString(),
        })
      ),
    })),
    events: (doc.events ?? [])
      .slice(-40)
      .reverse()
      .map((e: Record<string, any>) => ({
        kind: e.kind,
        amount: e.amount,
        label: e.label,
        topicSlug: e.topicSlug,
        createdAt: new Date(e.createdAt).toISOString(),
      })),
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}
