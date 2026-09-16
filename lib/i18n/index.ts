import type { Dict } from "./types";
import { en } from "./en";
import { id } from "./id";
import type { Locale } from "./config";

export const DICTIONARIES: Record<Locale, Dict> = { en, id };
export type { Dict };
