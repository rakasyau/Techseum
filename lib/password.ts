import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export interface PasswordIssue {
  code: string;
  message: string;
}

// Minimum viable policy: long enough to matter, and rejects the handful of
// passwords that make credential stuffing trivial.
export function validatePassword(password: string): PasswordIssue | null {
  if (password.length < 8) {
    return {
      code: "too_short",
      message: "Password must be at least 8 characters.",
    };
  }
  if (password.length > 200) {
    return { code: "too_long", message: "Password is too long." };
  }
  const common = [
    "password",
    "12345678",
    "qwertyui",
    "iloveyou",
    "letmein1",
    "admin123",
  ];
  if (common.includes(password.toLowerCase())) {
    return {
      code: "too_common",
      message: "That password is too common. Choose something less predictable.",
    };
  }
  return null;
}
