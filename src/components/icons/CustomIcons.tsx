import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// ── Categories & Technical Topics ───────────────────
export function CpuIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <rect x="9" y="9" width="6" height="6" fill={color} fillOpacity="0.15" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  );
}

export function WifiIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill={color} />
    </svg>
  );
}

export function CameraIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function SsdIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="15" x2="7" y2="15.01" strokeWidth="2.5" />
      <line x1="17" y1="9" x2="17" y2="15" />
      <line x1="13" y1="9" x2="13" y2="15" />
    </svg>
  );
}

export function GpuIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <circle cx="16" cy="12" r="2.5" />
      <line x1="6" y1="2" x2="6" y2="6" /><line x1="10" y1="2" x2="10" y2="6" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="18" y1="2" x2="18" y2="6" />
    </svg>
  );
}

export function DnsIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M12 8v4m0 0H6v4m6-4h6v4" />
    </svg>
  );
}

export function BluetoothIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
    </svg>
  );
}

export function RamIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      <rect x="5" y="10.5" width="2.5" height="3" fill={color} fillOpacity="0.2" />
      <rect x="9.5" y="10.5" width="2.5" height="3" fill={color} fillOpacity="0.2" />
      <rect x="14" y="10.5" width="2.5" height="3" fill={color} fillOpacity="0.2" />
      <line x1="6" y1="16" x2="6" y2="19" /><line x1="10" y1="16" x2="10" y2="19" /><line x1="14" y1="16" x2="14" y2="19" /><line x1="18" y1="16" x2="18" y2="19" />
    </svg>
  );
}

export function BatteryIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="17" height="12" rx="2" />
      <line x1="22" y1="10" x2="22" y2="14" />
      <line x1="7" y1="10" x2="7" y2="14" strokeWidth="2" />
      <line x1="11" y1="10" x2="11" y2="14" strokeWidth="2" />
    </svg>
  );
}

export function TouchscreenIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <circle cx="12" cy="11" r="3" strokeDasharray="2 2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
    </svg>
  );
}

export function NeuralIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <line x1="8.5" y1="7" x2="15.5" y2="11" />
      <line x1="8.5" y1="17" x2="15.5" y2="13" />
      <line x1="6" y1="8.5" x2="6" y2="15.5" strokeDasharray="2 2" />
    </svg>
  );
}

// ── Gamification & System Badges ───────────────────
export function FlameIcon({ size = 18, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" className={className}>
      <path d="M12 2c-.5 2.5-2 4.5-4 6-2.5 1.8-4 4.5-4 7.5a8 8 0 0 0 16 0c0-3.5-2-6-4.5-8-1-1-1.5-2.5-1.5-4 0-.5-.5-1.5-2-1.5z" />
    </svg>
  );
}

export function MuseumHallIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 22 7 12 2" />
      <line x1="5" y1="11" x2="5" y2="18" />
      <line x1="10" y1="11" x2="10" y2="18" />
      <line x1="14" y1="11" x2="14" y2="18" />
      <line x1="19" y1="11" x2="19" y2="18" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </svg>
  );
}

export function TrophyIcon({ size = 24, className, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M18 9h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

export function MedalGoldIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#F59E0B" fillOpacity="0.15" stroke="#D97706" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#D97706" fontFamily="var(--font-display)">
        1
      </text>
    </svg>
  );
}

export function MedalSilverIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#E5E7EB" fillOpacity="0.3" stroke="#9CA3AF" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#6B7280" fontFamily="var(--font-display)">
        2
      </text>
    </svg>
  );
}

export function MedalBronzeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#FDE68A" fillOpacity="0.15" stroke="#B45309" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#B45309" fontFamily="var(--font-display)">
        3
      </text>
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, className, color = "var(--color-success)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
