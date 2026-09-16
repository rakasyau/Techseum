import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/*
 * Route protection.
 *
 * This runs before the page is rendered, so gated content is never sent to an
 * anonymous visitor. A client-side gate would be too late: the page's HTML is
 * already serialized into the response by then.
 *
 * Public by design: the landing page, How It Works (scenarios), the Lab, About,
 * the auth pages, and the API routes that must work without a session
 * (auth, health, newsletter, and the read-only stats endpoints).
 */
const PUBLIC_PAGES = ["/", "/lab", "/about", "/login", "/register"];

const PUBLIC_PAGE_PREFIXES = ["/scenarios"];

const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/health",
  "/api/newsletter",
  "/api/stats",
  "/api/leaderboard",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PAGES.includes(pathname)) return true;
  if (PUBLIC_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return true;
  }
  if (PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (session) return NextResponse.next();

  // API routes answer with JSON so a fetch client can react to it.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 }
    );
  }

  // Pages redirect to sign-in, remembering where the visitor was headed.
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  /*
   * Run on everything except Next.js internals and static files. Matching
   * broadly and excluding here keeps the public list above as the single place
   * that decides what is open, rather than scattering that decision across
   * every route.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|txt|xml|webmanifest)).*)"],
};
