/*
 * Imported from the specific JWT subpaths rather than the "jose" root. The
 * root also exports JWE, which uses Node streaming APIs and cannot run in the
 * Edge runtime that middleware uses. Only signing and verifying are needed
 * here, so pulling in less keeps the middleware bundle clean.
 */
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { serverEnv } from "./env";

/*
 * Stateless sessions.
 *
 * The cookie carries a signed, short-lived JWT. It contains only the user id
 * and username, so nothing sensitive travels to the client. Every request that
 * needs fresh data still reads the user from MongoDB — the token proves
 * identity, it is not the source of truth.
 */

export const SESSION_COOKIE = "techseum_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  sub: string;
  username: string;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(serverEnv.authSecret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    return {
      sub: payload.sub,
      username: typeof payload.username === "string" ? payload.username : "",
    };
  } catch {
    // Expired, tampered with, or signed by a different secret.
    return null;
  }
}

/*
 * Cookies are marked Secure in production so they can never travel over plain
 * HTTP. One escape hatch exists, for local production testing only:
 *
 *   AUTH_COOKIE_INSECURE="true"   (unset everywhere else)
 *
 * `next start` always reports NODE_ENV=production, so without this a local
 * production smoke test cannot hold a session. Never set it in a deployment.
 */
function secureCookiesEnabled(): boolean {
  if (process.env.AUTH_COOKIE_INSECURE?.toLowerCase() === "true") return false;
  return process.env.NODE_ENV === "production";
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: secureCookiesEnabled(),
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
