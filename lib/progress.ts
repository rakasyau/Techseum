import { connectToDatabase } from "./mongodb";
import { User, toPublicUser, type PublicUser } from "./models/user";
import { XP_RULES, BADGE_RULES, dedupeKey, nextStreak } from "./xp";
import { TOPICS, getTopic } from "./data/topics";
import { CHALLENGES } from "./data/challenges";

/*
 * All XP mutations live here and run on the server.
 *
 * The client sends *what happened* (I read level 2, I answered this challenge),
 * never how much XP it is worth. Amounts come from lib/xp.ts. Every award is
 * deduplicated by a stable key, so replaying a request cannot farm XP.
 */

interface AwardResult {
  awarded: number;
  reason: string | null;
}

function awardOnce(
  doc: Record<string, any>,
  event: { kind: string; amount: number; key: string; topicSlug?: string; label: string }
): AwardResult {
  const already = (doc.events ?? []).some(
    (e: Record<string, any>) => e.key === event.key
  );
  if (already) return { awarded: 0, reason: null };

  doc.events = doc.events ?? [];
  doc.events.push({
    kind: event.kind,
    amount: event.amount,
    key: event.key,
    topicSlug: event.topicSlug,
    label: event.label,
    createdAt: new Date(),
  });
  doc.xp = (doc.xp ?? 0) + event.amount;
  return { awarded: event.amount, reason: event.label };
}

function findProgress(doc: Record<string, any>, topicSlug: string) {
  doc.progress = doc.progress ?? [];
  let entry = doc.progress.find(
    (p: Record<string, any>) => p.topicSlug === topicSlug
  );
  if (!entry) {
    entry = {
      topicSlug,
      status: "not-started",
      levelReached: 1,
      completedLevels: [],
      completedBonusPaid: false,
      challengeResults: [],
      lastViewedAt: new Date(),
    };
    doc.progress.push(entry);
  }
  return entry;
}

function evaluateBadges(doc: Record<string, any>): string[] {
  const earned = new Set<string>(doc.badges ?? []);
  const completed = (doc.progress ?? []).filter(
    (p: Record<string, any>) => p.status === "completed"
  );
  const completedSlugs = completed.map((p: Record<string, any>) => p.topicSlug);

  if (completedSlugs.length >= 1) earned.add(BADGE_RULES.firstExplorer);
  if (completedSlugs.length >= 5) earned.add(BADGE_RULES.challengeChaser);
  if ((doc.streak?.current ?? 0) >= 7) earned.add(BADGE_RULES.sevenDayStreak);

  // Deep Dive: finished every level of any exhibit.
  const didDeepDive = (doc.progress ?? []).some(
    (p: Record<string, any>) =>
      p.completedLevels?.includes(4) && (p.challengeResults ?? []).length > 0
  );
  if (didDeepDive) earned.add(BADGE_RULES.deepDiver);

  // CPU Master: the CPU exhibit at all four levels, every challenge correct.
  const cpu = (doc.progress ?? []).find(
    (p: Record<string, any>) => p.topicSlug === "cpu"
  );
  if (
    cpu &&
    [1, 2, 3, 4].every((l) => cpu.completedLevels?.includes(l)) &&
    (cpu.challengeResults ?? []).length > 0 &&
    (cpu.challengeResults ?? []).every((c: Record<string, any>) => c.correct)
  ) {
    earned.add(BADGE_RULES.cpuMaster);
  }

  // Category champion: every exhibit in the wing completed.
  for (const category of ["computing", "networking"] as const) {
    const slugs = TOPICS.filter((t) => t.category === category).map(
      (t) => t.slug
    );
    if (slugs.length > 0 && slugs.every((s) => completedSlugs.includes(s))) {
      earned.add(
        category === "computing"
          ? BADGE_RULES.categoryChampionComputing
          : BADGE_RULES.categoryChampionNetworking
      );
    }
  }

  const list = Array.from(earned);
  const changed = list.length !== (doc.badges ?? []).length;
  doc.badges = list;
  return changed ? list : [];
}

function touchActivity(doc: Record<string, any>) {
  doc.streak = nextStreak({
    current: doc.streak?.current ?? 0,
    longest: doc.streak?.longest ?? 0,
    lastActiveDate: doc.streak?.lastActiveDate ?? null,
  });
  doc.lastSeenAt = new Date();
}

export async function recordLevelRead(
  userId: string,
  topicSlug: string,
  level: number
): Promise<{ user: PublicUser; awarded: number }> {
  const topic = getTopic(topicSlug);
  if (!topic) throw new Error("Unknown topic");
  if (!topic.levels.some((l) => l.level === level)) {
    throw new Error("Unknown level for this topic");
  }

  await connectToDatabase();
  const doc = await User.findById(userId);
  if (!doc) throw new Error("User not found");

  const raw = doc.toObject() as Record<string, any>;
  const entry = findProgress(raw, topicSlug);
  entry.lastViewedAt = new Date();
  entry.levelReached = Math.max(entry.levelReached ?? 1, level);
  if (!entry.completedLevels) entry.completedLevels = [];

  let awarded = 0;
  if (!entry.completedLevels.includes(level)) {
    entry.completedLevels.push(level);
    const result = awardOnce(raw, {
      kind: "level-read",
      amount: XP_RULES.levelRead,
      key: dedupeKey("level", topicSlug, level),
      topicSlug,
      label: `Read ${topic.title} level ${level}`,
    });
    awarded += result.awarded;
  }

  const allLevels = topic.levels.map((l) => l.level);
  const finishedAll = allLevels.every((l) =>
    entry.completedLevels.includes(l)
  );
  if (finishedAll && !entry.completedBonusPaid) {
    entry.completedBonusPaid = true;
    const result = awardOnce(raw, {
      kind: "topic-complete",
      amount: XP_RULES.topicCompleteBonus,
      key: dedupeKey("complete", topicSlug),
      topicSlug,
      label: `Completed ${topic.title}`,
    });
    awarded += result.awarded;
  }

  entry.status = finishedAll
    ? "completed"
    : entry.completedLevels.length > 0
      ? "in-progress"
      : "not-started";

  touchActivity(raw);
  evaluateBadges(raw);

  doc.set(raw);
  await doc.save();
  return { user: toPublicUser(doc.toObject()), awarded };
}

export async function recordChallengeAttempt(
  userId: string,
  challengeId: string,
  correct: boolean
): Promise<{ user: PublicUser; awarded: number }> {
  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) throw new Error("Unknown challenge");

  await connectToDatabase();
  const doc = await User.findById(userId);
  if (!doc) throw new Error("User not found");

  const raw = doc.toObject() as Record<string, any>;
  const entry = findProgress(raw, challenge.topicSlug);
  entry.lastViewedAt = new Date();
  entry.challengeResults = entry.challengeResults ?? [];

  const existing = entry.challengeResults.find(
    (c: Record<string, any>) => c.challengeId === challengeId
  );
  if (existing) {
    existing.attempts = (existing.attempts ?? 0) + 1;
    existing.attemptedAt = new Date();
    if (correct) existing.correct = true;
  } else {
    entry.challengeResults.push({
      challengeId,
      correct,
      attempts: 1,
      attemptedAt: new Date(),
    });
  }

  let awarded = 0;
  if (correct) {
    const amount =
      challenge.bucket === "daily"
        ? XP_RULES.dailyChallenge
        : XP_RULES.challengeCorrect;
    // Paid once per challenge, regardless of later retries.
    const result = awardOnce(raw, {
      kind: challenge.bucket === "daily" ? "daily" : "challenge",
      amount,
      key: dedupeKey("challenge", challengeId),
      topicSlug: challenge.topicSlug,
      label: `Solved: ${challenge.question.slice(0, 60)}`,
    });
    awarded += result.awarded;
  }

  if (entry.status === "not-started") entry.status = "in-progress";

  touchActivity(raw);
  evaluateBadges(raw);

  doc.set(raw);
  await doc.save();
  return { user: toPublicUser(doc.toObject()), awarded };
}

export async function toggleBookmark(
  userId: string,
  topicSlug: string,
  bookmarked: boolean
): Promise<PublicUser> {
  if (!getTopic(topicSlug)) throw new Error("Unknown topic");

  await connectToDatabase();
  const doc = await User.findById(userId);
  if (!doc) throw new Error("User not found");

  const raw = doc.toObject() as Record<string, any>;
  const set = new Set<string>(raw.bookmarks ?? []);
  if (bookmarked) set.add(topicSlug);
  else set.delete(topicSlug);
  raw.bookmarks = Array.from(set);

  doc.set(raw);
  await doc.save();
  return toPublicUser(doc.toObject());
}

export async function updatePreferences(
  userId: string,
  patch: {
    language?: "en" | "id";
    theme?: "light" | "dark" | "system";
    defaultLevel?: number;
    reducedMotion?: boolean;
  }
): Promise<PublicUser> {
  await connectToDatabase();
  const doc = await User.findById(userId);
  if (!doc) throw new Error("User not found");

  const raw = doc.toObject() as Record<string, any>;
  raw.preferences = { ...(raw.preferences ?? {}), ...patch };

  doc.set(raw);
  await doc.save();
  return toPublicUser(doc.toObject());
}
