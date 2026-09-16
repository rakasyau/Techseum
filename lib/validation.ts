import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username must be at most 24 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Username may only contain letters, numbers and underscores."
    ),
  displayName: z
    .string()
    .trim()
    .min(1, "Please enter a name.")
    .max(60, "Name is too long."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
});

export const progressSchema = z.object({
  topicSlug: z.string().trim().min(1),
  // Reading a level is the only client-initiated progress action; everything
  // else is derived server-side from an actual challenge attempt.
  action: z.literal("read-level"),
  level: z.number().int().min(1).max(4),
});

export const challengeAttemptSchema = z.object({
  challengeId: z.string().trim().min(1),
  correct: z.boolean(),
});

export const bookmarkSchema = z.object({
  topicSlug: z.string().trim().min(1),
  bookmarked: z.boolean(),
});

export const preferencesSchema = z.object({
  language: z.enum(["en", "id"]).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  defaultLevel: z.number().int().min(1).max(4).optional(),
  reducedMotion: z.boolean().optional(),
});

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request.";
}
