import { cn } from "@/lib/utils";

/* Deterministic tonal avatars from the palette. No stock photography, no
   invented faces — a lettered chip on a considered colour. */
const AVATAR_TONES = [
  "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--signal)))",
  "linear-gradient(135deg, rgb(var(--accent-deep)), rgb(var(--accent)))",
  "linear-gradient(135deg, rgb(var(--signal)), rgb(var(--warn)))",
  "linear-gradient(135deg, rgb(var(--ink)), rgb(var(--ink-muted)))",
  "linear-gradient(135deg, rgb(var(--success)), rgb(var(--signal)))",
  "linear-gradient(135deg, rgb(var(--warn)), rgb(var(--danger)))",
];

export function avatarBg(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

export function Avatar({
  seed,
  size = 36,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: avatarBg(seed),
      }}
      aria-hidden
    >
      {seed}
    </span>
  );
}
