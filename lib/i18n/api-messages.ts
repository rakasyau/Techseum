import type { Locale } from "./config";

/*
 * Server-side user-facing messages.
 *
 * Validation schemas are authored once in `lib/validation.ts`; rather than
 * keeping parallel schemas per language, the routes translate the chosen
 * message before sending it. A message with no entry is passed through
 * unchanged, so adding a schema never silently drops an error.
 */

type Key =
  | "email"
  | "usernameShort"
  | "usernameLong"
  | "usernameChars"
  | "nameRequired"
  | "nameLong"
  | "passwordShort"
  | "identifierRequired"
  | "passwordRequired"
  | "invalidRequest"
  | "invalidBody"
  | "serviceUnavailable"
  | "credentialsMismatch"
  | "notSignedIn"
  | "unknownAction"
  | "alreadyRegistered"
  | "couldNotSave"
  | "passwordTooLong"
  | "passwordTooCommon"
  | "saveProgress"
  | "passwordField"
  | "usernameField"
  | "emailField";

const EN: Record<Key, string> = {
  email: "Enter a valid email address.",
  usernameShort: "Username must be at least 3 characters.",
  usernameLong: "Username must be at most 24 characters.",
  usernameChars: "Username may only contain letters, numbers and underscores.",
  nameRequired: "Please enter a name.",
  nameLong: "Name is too long.",
  passwordShort: "Password must be at least 8 characters.",
  identifierRequired: "Enter your email or username.",
  passwordRequired: "Enter your password.",
  invalidRequest: "Invalid request.",
  invalidBody: "Invalid request body.",
  serviceUnavailable: "The service is temporarily unavailable. Please try again.",
  credentialsMismatch: "Those credentials do not match an account.",
  notSignedIn: "Not signed in.",
  unknownAction: "Unknown action.",
  alreadyRegistered: "That {field} is already registered.",
  couldNotSave: "Could not save your subscription. Please try again.",
  passwordTooLong: "Password is too long.",
  passwordTooCommon: "That password is too common. Choose something less predictable.",
  saveProgress: "Could not save your progress.",
  passwordField: "password",
  usernameField: "username",
  emailField: "email address",
};

const ID: Record<Key, string> = {
  email: "Masukkan alamat email yang valid.",
  usernameShort: "Nama pengguna minimal 3 karakter.",
  usernameLong: "Nama pengguna maksimal 24 karakter.",
  usernameChars: "Nama pengguna hanya boleh berisi huruf, angka dan garis bawah.",
  nameRequired: "Silakan masukkan nama.",
  nameLong: "Nama terlalu panjang.",
  passwordShort: "Kata sandi minimal 8 karakter.",
  identifierRequired: "Masukkan email atau nama penggunamu.",
  passwordRequired: "Masukkan kata sandimu.",
  invalidRequest: "Permintaan tidak valid.",
  invalidBody: "Isi permintaan tidak valid.",
  serviceUnavailable: "Layanan sementara tidak tersedia. Silakan coba lagi.",
  credentialsMismatch: "Kredensial itu tidak cocok dengan akun mana pun.",
  notSignedIn: "Belum masuk.",
  unknownAction: "Aksi tidak dikenal.",
  alreadyRegistered: "{field} itu sudah terdaftar.",
  couldNotSave: "Gagal menyimpan langgananmu. Silakan coba lagi.",
  passwordTooLong: "Kata sandi terlalu panjang.",
  passwordTooCommon: "Kata sandi itu terlalu umum. Pilih yang lebih sulit ditebak.",
  saveProgress: "Gagal menyimpan progresmu.",
  passwordField: "kata sandi",
  usernameField: "nama pengguna",
  emailField: "alamat email",
};

const TABLES: Record<Locale, Record<Key, string>> = { en: EN, id: ID };

/** Authored English validation messages, mapped to their key. */
const VALIDATION_LOOKUP: Record<string, Key> = {
  "Enter a valid email address.": "email",
  "Username must be at least 3 characters.": "usernameShort",
  "Username must be at most 24 characters.": "usernameLong",
  "Username may only contain letters, numbers and underscores.": "usernameChars",
  "Please enter a name.": "nameRequired",
  "Name is too long.": "nameLong",
  "Password must be at least 8 characters.": "passwordShort",
  "Enter your email or username.": "identifierRequired",
  "Enter your password.": "passwordRequired",
  "Invalid request.": "invalidRequest",
};

export function msg(key: Key, locale: Locale): string {
  return TABLES[locale][key];
}

/** Translate a validation message by its authored English text. */
export function translateValidation(message: string, locale: Locale): string {
  const key = VALIDATION_LOOKUP[message];
  return key ? TABLES[locale][key] : message;
}

/** Translate a password policy code from lib/password.ts. */
export function translatePassword(code: string, locale: Locale): string {
  if (code === "too_short") return TABLES[locale].passwordShort;
  if (code === "too_long") return TABLES[locale].passwordTooLong;
  if (code === "too_common") return TABLES[locale].passwordTooCommon;
  return TABLES[locale].passwordShort;
}
