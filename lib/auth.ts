import { cookies } from "next/headers";
import { connectToDatabase } from "./mongodb";
import { User, toPublicUser, type PublicUser } from "./models/user";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSession,
  verifySession,
} from "./session";
import { hashPassword, verifyPassword } from "./password";

// Reads the signed session cookie and loads the live user document.
// Returns null for anonymous visitors, which is not an error.
export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return null;

  await connectToDatabase();
  const doc = await User.findById(session.sub).lean();
  if (!doc) return null;
  return toPublicUser(doc as Record<string, unknown>);
}

// Requires a session; throws an error the routes translate to a 401.
export class UnauthorizedError extends Error {
  constructor() {
    super("Not signed in");
    this.name = "UnauthorizedError";
  }
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

// Issues the session cookie. Call only from a route handler or server action.
export async function startSession(userId: string, username: string) {
  const token = await signSession({ sub: userId, username });
  cookies().set(SESSION_COOKIE, token, sessionCookieOptions);
}

export function endSession() {
  cookies().set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
}

export { hashPassword, verifyPassword };
