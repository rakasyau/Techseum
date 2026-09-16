import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { DICTIONARIES } from "./index";
import type { Dict } from "./types";

/*
 * Server-side localization.
 *
 * The exhibit, scenario and listing pages are rendered per request so the
 * first paint is already in the visitor's language, with no flash of English.
 * Both the server helpers here and the client LanguageProvider read the same
 * cookie, so they always agree.
 */
export function getServerLocale(): Locale {
  const value = cookies().get("techseum_lang")?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getServerDict(): Dict {
  return DICTIONARIES[getServerLocale()];
}

/*
 * Route handlers receive the raw request, where `cookies()` may not reflect
 * the caller. Reading the cookie header directly keeps API errors in the same
 * language as the page that made the call.
 */
export function getRequestLocale(request: NextRequest | Request): Locale {
  const header = request.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("techseum_lang="));
  const value = match?.slice("techseum_lang=".length);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
