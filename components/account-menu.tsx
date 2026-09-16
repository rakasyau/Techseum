"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Trophy, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { levelProgress, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/rank-board";

/*
 * Account control in the header. Three states: still loading, signed out (a
 * single sign-in/register pair), and signed in (avatar plus a menu with the
 * user's level, profile link and sign out).
 */
export function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (loading) {
    return (
      <span
        aria-hidden
        className="h-10 w-10 animate-pulse rounded-full bg-paper-sink"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden h-10 items-center rounded-full px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink sm:flex"
        >
          {t.nav.signIn}
        </Link>
        <Link
          href="/register"
          aria-label={t.nav.register}
          className="inline-flex h-10 items-center rounded-full bg-ink px-3 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft sm:px-4"
        >
          <span className="hidden sm:inline">{t.nav.register}</span>
          <UserIcon size={16} className="sm:hidden" aria-hidden />
        </Link>
      </div>
    );
  }

  const level = levelProgress(user.xp);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.nav.profile}
        className="flex h-10 items-center gap-2.5 rounded-full border border-line pl-1 pr-3 transition-colors hover:border-line-strong"
      >
        <Avatar seed={user.avatarSeed} size={32} />
        <span className="max-w-[90px] truncate text-[13px] font-medium">
          {user.displayName}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[248px] overflow-hidden rounded-xl border border-line bg-paper shadow-pop"
        >
          <div className="border-b border-line bg-paper-alt p-4">
            <div className="flex items-center gap-3">
              <Avatar seed={user.avatarSeed} size={40} />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold">
                  {user.displayName}
                </p>
                <p className="truncate text-2xs text-ink-muted">
                  @{user.username}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-2xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Trophy size={12} aria-hidden />
                <span className="tnum font-medium text-ink-soft">
                  {formatNumber(user.xp)}
                </span>
                {t.common.xp}
              </span>
              <span>
                {t.common.level} {level.level}
              </span>
            </div>
          </div>

          <div className="p-1">
            <Link
              href="/profile/you"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-ink-soft transition-colors hover:bg-paper-alt hover:text-ink"
            >
              <UserIcon size={15} />
              {t.nav.profile}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-paper-alt hover:text-ink"
            >
              <LogOut size={15} />
              {t.nav.signOut}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
