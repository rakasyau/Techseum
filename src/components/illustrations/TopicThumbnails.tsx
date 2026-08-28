import React from "react";

export function CpuThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="siliconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
      </defs>
      {/* PCB Substrate */}
      <rect x="30" y="20" width="180" height="120" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      {/* Gold Contact Pins */}
      {[50, 70, 90, 110, 130, 150, 170, 190].map((x) => (
        <g key={x}>
          <line x1={x} y1="12" x2={x} y2="20" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={x} y1="140" x2={x} y2="148" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      {[35, 55, 75, 95, 115].map((y) => (
        <g key={y}>
          <line x1="22" y1={y} x2="30" y2={y} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="210" y1={y} x2="218" y2={y} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      {/* Silicon Die Center */}
      <rect x="65" y="40" width="110" height="80" rx="6" fill="url(#siliconGrad)" stroke="#6366F1" strokeWidth="2" />
      {/* Core Matrix */}
      <rect x="75" y="48" width="42" height="30" rx="3" fill="#4F46E5" fillOpacity="0.4" stroke="#818CF8" strokeWidth="1" />
      <text x="96" y="67" fill="#E0E7FF" fontSize="9" fontWeight="700" textAnchor="middle">CORE 0</text>
      <rect x="123" y="48" width="42" height="30" rx="3" fill="#4F46E5" fillOpacity="0.4" stroke="#818CF8" strokeWidth="1" />
      <text x="144" y="67" fill="#E0E7FF" fontSize="9" fontWeight="700" textAnchor="middle">CORE 1</text>
      <rect x="75" y="82" width="90" height="14" rx="3" fill="#10B981" fillOpacity="0.3" stroke="#34D399" strokeWidth="1" />
      <text x="120" y="93" fill="#A7F3D0" fontSize="8" fontWeight="600" textAnchor="middle">L3 SHARED CACHE</text>
      <rect x="75" y="100" width="90" height="12" rx="2" fill="#F59E0B" fillOpacity="0.2" stroke="#FBBF24" strokeWidth="1" />
      <text x="120" y="109" fill="#FDE68A" fontSize="7" fontWeight="600" textAnchor="middle">MEMORY BUS (DDR5)</text>
    </svg>
  );
}

export function WifiThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <circle cx="120" cy="120" r="100" stroke="#06B6D4" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="120" cy="120" r="75" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="120" cy="120" r="50" stroke="#6366F1" strokeOpacity="0.6" strokeWidth="2.5" />
      <circle cx="120" cy="120" r="25" stroke="#818CF8" strokeOpacity="0.9" strokeWidth="3" />
      
      {/* Router Base */}
      <rect x="70" y="115" width="100" height="26" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
      {/* Antennas */}
      <line x1="80" y1="115" x2="68" y2="70" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="68" cy="70" r="3.5" fill="#38BDF8" />
      <line x1="105" y1="115" x2="105" y2="60" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="105" cy="60" r="3.5" fill="#38BDF8" />
      <line x1="135" y1="115" x2="135" y2="60" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="135" cy="60" r="3.5" fill="#38BDF8" />
      <line x1="160" y1="115" x2="172" y2="70" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="172" cy="70" r="3.5" fill="#38BDF8" />

      {/* LEDs */}
      <circle cx="85" cy="128" r="2.5" fill="#10B981" />
      <circle cx="95" cy="128" r="2.5" fill="#10B981" />
      <circle cx="105" cy="128" r="2.5" fill="#38BDF8" />
      <text x="140" y="131" fill="#94A3B8" fontSize="7" fontWeight="600">6 GHz OFDMA</text>
    </svg>
  );
}

export function CameraThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Light Rays */}
      <polygon points="10,40 10,120 70,110 70,50" fill="url(#lensGrad)" fillOpacity="0.25" />
      <line x1="10" y1="40" x2="70" y2="50" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="10" y1="80" x2="180" y2="80" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="10" y1="120" x2="70" y2="110" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Lens Optical Elements */}
      <path d="M75,30 Q90,80 75,130" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M95,35 Q85,80 95,125" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Aperture Blades */}
      <rect x="110" y="30" width="8" height="35" fill="#475569" rx="2" />
      <rect x="110" y="95" width="8" height="35" fill="#475569" rx="2" />

      {/* Bayer Matrix CFA */}
      <rect x="135" y="45" width="16" height="70" rx="3" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
      <rect x="137" y="48" width="5" height="5" fill="#EF4444" />
      <rect x="144" y="48" width="5" height="5" fill="#22C55E" />
      <rect x="137" y="55" width="5" height="5" fill="#22C55E" />
      <rect x="144" y="55" width="5" height="5" fill="#3B82F6" />
      
      {/* Sensor Die */}
      <rect x="160" y="35" width="45" height="90" rx="5" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
      <text x="182" y="83" fill="#A5B4FC" fontSize="7" fontWeight="700" textAnchor="middle">BSI CMOS</text>
      <text x="182" y="93" fill="#818CF8" fontSize="6" textAnchor="middle">50 MP</text>
    </svg>
  );
}

export function SsdThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="25" y="30" width="190" height="100" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      {/* PCIe Gold Pins */}
      {[35, 42, 49, 56, 63, 70, 77, 84, 91, 98].map((x) => (
        <rect key={x} x={x} y="118" width="4" height="12" fill="#F59E0B" rx="1" />
      ))}
      <rect x="105" y="118" width="30" height="12" fill="#0F172A" />
      {[138, 145, 152, 159, 166, 173, 180, 187, 194, 201].map((x) => (
        <rect key={x} x={x} y="118" width="4" height="12" fill="#F59E0B" rx="1" />
      ))}
      
      {/* Controller */}
      <rect x="40" y="45" width="45" height="45" rx="4" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
      <text x="62" y="66" fill="#E0E7FF" fontSize="7" fontWeight="700" textAnchor="middle">NVMe</text>
      <text x="62" y="76" fill="#818CF8" fontSize="6" textAnchor="middle">CTRL</text>

      {/* DRAM Cache */}
      <rect x="92" y="45" width="22" height="35" rx="3" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
      <text x="103" y="65" fill="#A7F3D0" fontSize="6" fontWeight="600" textAnchor="middle">DRAM</text>

      {/* 3D NAND Chips */}
      <rect x="122" y="42" width="40" height="65" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="142" y="72" fill="#FDE68A" fontSize="7" fontWeight="700" textAnchor="middle">3D TLC</text>
      <text x="142" y="82" fill="#FBBF24" fontSize="6" textAnchor="middle">176L</text>

      <rect x="168" y="42" width="40" height="65" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="188" y="72" fill="#FDE68A" fontSize="7" fontWeight="700" textAnchor="middle">3D TLC</text>
      <text x="188" y="82" fill="#FBBF24" fontSize="6" textAnchor="middle">NAND</text>
    </svg>
  );
}

export function GpuThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="30" y="20" width="180" height="120" rx="8" fill="#0F172A" stroke="#22C55E" strokeWidth="2" />
      <rect x="75" y="45" width="90" height="70" rx="6" fill="#052E16" stroke="#4ADE80" strokeWidth="2" />
      <text x="120" y="75" fill="#86EFAC" fontSize="9" fontWeight="800" textAnchor="middle">GPU DIE</text>
      <text x="120" y="88" fill="#4ADE80" fontSize="7" fontWeight="600" textAnchor="middle">16,384 CORES</text>
      {/* VRAM Chips Around GPU */}
      <rect x="42" y="52" width="26" height="18" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <rect x="42" y="78" width="26" height="18" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <rect x="172" y="52" width="26" height="18" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <rect x="172" y="78" width="26" height="18" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <rect x="85" y="26" width="30" height="14" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <rect x="125" y="26" width="30" height="14" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
      <text x="120" y="127" fill="#FDE68A" fontSize="7" fontWeight="600" textAnchor="middle">GDDR6X 1008 GB/s</text>
    </svg>
  );
}

export function DnsThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <circle cx="120" cy="35" r="20" fill="#1E1B4B" stroke="#818CF8" strokeWidth="2" />
      <text x="120" y="39" fill="#E0E7FF" fontSize="11" fontWeight="800" textAnchor="middle">. (Root)</text>
      
      <line x1="110" y1="55" x2="65" y2="80" stroke="#6366F1" strokeWidth="2" />
      <line x1="130" y1="55" x2="175" y2="80" stroke="#6366F1" strokeWidth="2" />

      <rect x="35" y="80" width="60" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <text x="65" y="96" fill="#BAE6FD" fontSize="9" fontWeight="700" textAnchor="middle">.COM</text>

      <rect x="145" y="80" width="60" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <text x="175" y="96" fill="#BAE6FD" fontSize="9" fontWeight="700" textAnchor="middle">.ORG</text>

      <line x1="65" y1="104" x2="65" y2="125" stroke="#0EA5E9" strokeWidth="2" />
      <rect x="25" y="125" width="80" height="25" rx="5" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
      <text x="65" y="137" fill="#A7F3D0" fontSize="7" fontWeight="700" textAnchor="middle">google.com</text>
      <text x="65" y="146" fill="#6EE7B7" fontSize="6" textAnchor="middle">142.250.190.46</text>
    </svg>
  );
}

export function BluetoothThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="30" y="20" width="180" height="120" rx="12" fill="#0B132B" stroke="#3B82F6" strokeWidth="2" />
      {/* Bluetooth Rune Icon */}
      <path
        d="M120,35 L120,125 L145,100 L95,60 L145,60 L95,100 L120,75"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Frequency Hop Bands */}
      <circle cx="120" cy="80" r="45" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
      <circle cx="120" cy="80" r="60" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.3" />
      <text x="120" y="133" fill="#93C5FD" fontSize="8" fontWeight="700" textAnchor="middle">2.4 GHz AFH · 1,600 hops/s</text>
    </svg>
  );
}

export function RamThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="20" y="45" width="200" height="70" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={30 + i * 23} y="55" width="17" height="32" rx="2" fill="#18181B" stroke="#475569" strokeWidth="1" />
      ))}
      {/* Gold Contact Notch */}
      {[25, 35, 45, 55, 65, 75, 85, 95, 105, 125, 135, 145, 155, 165, 175, 185, 195, 205].map((x) => (
        <rect key={x} x={x} y="105" width="5" height="10" fill="#F59E0B" />
      ))}
      <rect x="112" y="105" width="10" height="10" fill="#070A12" />
      <text x="120" y="100" fill="#A7F3D0" fontSize="7" fontWeight="700" textAnchor="middle">DDR5 6400 MT/s</text>
    </svg>
  );
}

export function BatteryThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="40" y="40" width="150" height="80" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <rect x="190" y="65" width="10" height="30" rx="3" fill="#64748B" />
      <rect x="45" y="46" width="40" height="68" rx="5" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1" />
      <text x="65" y="84" fill="#BAE6FD" fontSize="8" fontWeight="700" textAnchor="middle">ANODE (-)</text>
      <line x1="92" y1="46" x2="92" y2="114" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
      <text x="115" y="84" fill="#FDE68A" fontSize="9" fontWeight="800" textAnchor="middle">Li+</text>
      <rect x="145" y="46" width="40" height="68" rx="5" fill="#059669" fillOpacity="0.4" stroke="#34D399" strokeWidth="1" />
      <text x="165" y="84" fill="#A7F3D0" fontSize="8" fontWeight="700" textAnchor="middle">CATHODE (+)</text>
      <text x="115" y="132" fill="#94A3B8" fontSize="7" textAnchor="middle">Lithium-Ion Intercalation</text>
    </svg>
  );
}

export function TouchscreenThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="45" y="25" width="150" height="110" rx="10" fill="#030712" stroke="#38BDF8" strokeWidth="2" />
      {[50, 75, 100, 125].map((y) => (
        <line key={y} x1="55" y1={y} x2="185" y2={y} stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.6" />
      ))}
      {[70, 95, 120, 145, 170].map((x) => (
        <line key={x} x1={x} y1="35" x2={x} y2="125" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.6" />
      ))}
      {/* Touch Point */}
      <circle cx="120" cy="75" r="18" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <circle cx="120" cy="75" r="9" fill="#38BDF8" fillOpacity="0.5" stroke="#67E8F9" strokeWidth="1.5" />
      <circle cx="120" cy="75" r="3" fill="#FFFFFF" />
      <text x="120" y="128" fill="#BAE6FD" fontSize="8" fontWeight="700" textAnchor="middle">Capacitive ITO Grid (ΔC)</text>
    </svg>
  );
}

export function NeuralThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {[45, 80, 115].map((y1) =>
        [35, 65, 95, 125].map((y2) => (
          <line key={`${y1}-${y2}`} x1="50" y1={y1} x2="120" y2={y2} stroke="#6366F1" strokeOpacity="0.3" strokeWidth="1.2" />
        ))
      )}
      {[35, 65, 95, 125].map((y1) =>
        [60, 100].map((y2) => (
          <line key={`${y1}-${y2}`} x1="120" y1={y1} x2="190" y2={y2} stroke="#EC4899" strokeOpacity="0.4" strokeWidth="1.2" />
        ))
      )}
      {[45, 80, 115].map((y, i) => (
        <circle key={i} cx="50" cy={y} r="8" fill="#312E81" stroke="#818CF8" strokeWidth="2" />
      ))}
      {[35, 65, 95, 125].map((y, i) => (
        <circle key={i} cx="120" cy={y} r="9" fill="#4C1D95" stroke="#A855F7" strokeWidth="2" />
      ))}
      {[60, 100].map((y, i) => (
        <circle key={i} cx="190" cy={y} r="10" fill="#831843" stroke="#F43F5E" strokeWidth="2" />
      ))}
      <text x="120" y="148" fill="#F472B6" fontSize="8" fontWeight="700" textAnchor="middle">Backpropagation &amp; Weights</text>
    </svg>
  );
}

/* ── NEW EVERYDAY & MOBILE TECH PACK THUMBNAILS ────────────── */

export function GpsThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Earth Surface Sphere */}
      <circle cx="120" cy="140" r="50" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
      <path d="M90,120 Q120,110 150,120 Q130,145 90,120" fill="#0284C7" fillOpacity="0.4" />
      
      {/* Satellites in Orbit */}
      <g transform="translate(40, 30)">
        <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
        <line x1="-16" y1="0" x2="-8" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <line x1="8" y1="0" x2="16" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="#38BDF8" />
        <path d="M0,0 L80,80" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.8" />
      </g>

      <g transform="translate(120, 20)">
        <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
        <line x1="-16" y1="0" x2="-8" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <line x1="8" y1="0" x2="16" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="#38BDF8" />
        <path d="M0,0 L0,90" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.8" />
      </g>

      <g transform="translate(200, 30)">
        <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
        <line x1="-16" y1="0" x2="-8" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <line x1="8" y1="0" x2="16" y2="0" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="#38BDF8" />
        <path d="M0,0 L-80,80" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.8" />
      </g>

      {/* Intersection Point (User) */}
      <circle cx="120" cy="110" r="8" fill="#10B981" fillOpacity="0.4" stroke="#34D399" strokeWidth="2" />
      <circle cx="120" cy="110" r="3" fill="#FFFFFF" />
      <text x="120" y="152" fill="#67E8F9" fontSize="8" fontWeight="700" textAnchor="middle">Trilateration (X, Y, Z, t)</text>
    </svg>
  );
}

export function AncThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Headphone Outline */}
      <path d="M65,110 C65,45 175,45 175,110" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="50" y="90" width="24" height="42" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
      <rect x="166" y="90" width="24" height="42" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />

      {/* External Noise Sine Wave (Red/Amber) */}
      <path
        d="M20,60 Q35,40 50,60 T80,60"
        stroke="#EF4444"
        strokeWidth="2.5"
        fill="none"
      />
      <text x="35" y="45" fill="#FCA5A5" fontSize="7" fontWeight="600">Noise (+A)</text>

      {/* Anti-Phase Inverted Wave (Blue) */}
      <path
        d="M20,60 Q35,80 50,60 T80,60"
        stroke="#38BDF8"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="4 2"
      />
      <text x="35" y="85" fill="#93C5FD" fontSize="7" fontWeight="600">Anti-Phase (-A)</text>

      {/* Resulting Flat Line of Silence */}
      <line x1="85" y1="110" x2="155" y2="110" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      <text x="120" y="102" fill="#34D399" fontSize="8" fontWeight="800" textAnchor="middle">SILENCE (0 dB)</text>
      <text x="120" y="145" fill="#94A3B8" fontSize="7" textAnchor="middle">Destructive Interference</text>
    </svg>
  );
}

export function OledThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="30" y="25" width="180" height="110" rx="8" fill="#030712" stroke="#475569" strokeWidth="2" />
      {/* Subpixel RGB Clusters */}
      {[0, 1, 2].map((col) => (
        <g key={col} transform={`translate(${55 + col * 46}, 40)`}>
          {/* Red Subpixel */}
          <rect x="0" y="0" width="11" height="50" rx="3" fill="#EF4444" stroke="#F87171" strokeWidth="1.5" />
          {/* Green Subpixel */}
          <rect x="14" y="0" width="11" height="50" rx="3" fill="#22C55E" stroke="#4ADE80" strokeWidth="1.5" />
          {/* Blue Subpixel */}
          <rect x="28" y="0" width="11" height="50" rx="3" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1.5" />
        </g>
      ))}

      {/* True Black Zero Emissive Off State Indicator */}
      <rect x="145" y="38" width="55" height="54" rx="4" fill="#000000" stroke="#1E293B" strokeWidth="1.5" />
      <text x="172" y="68" fill="#64748B" fontSize="7" fontWeight="700" textAnchor="middle">TRUE</text>
      <text x="172" y="78" fill="#64748B" fontSize="7" fontWeight="700" textAnchor="middle">BLACK (0V)</text>

      <text x="120" y="118" fill="#F8FAFC" fontSize="8" fontWeight="700" textAnchor="middle">Self-Emissive Organic Diodes</text>
      <text x="120" y="128" fill="#94A3B8" fontSize="6.5" textAnchor="middle">Infinite Contrast Ratio (∞:1)</text>
    </svg>
  );
}

export function FaceIdThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Phone Notch with Sensors */}
      <rect x="50" y="20" width="140" height="24" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
      <circle cx="85" cy="32" r="3.5" fill="#EF4444" /> {/* Flood Illuminator */}
      <circle cx="120" cy="32" r="4.5" fill="#1E293B" stroke="#6366F1" strokeWidth="1.5" /> {/* Camera */}
      <circle cx="155" cy="32" r="3.5" fill="#A855F7" /> {/* Dot Projector */}

      {/* 30,000 IR Dot Matrix Grid mapping face */}
      <path d="M85,55 Q120,40 155,55 Q170,95 155,125 Q120,140 85,125 Q70,95 85,55" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Projected IR Dots */}
      {[
        [95, 65], [120, 60], [145, 65],
        [100, 80], [120, 75], [140, 80],
        [110, 95], [120, 95], [130, 95],
        [105, 110], [120, 112], [135, 110],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#C084FC" />
      ))}

      <text x="120" y="145" fill="#C084FC" fontSize="8" fontWeight="700" textAnchor="middle">30,000 Structured IR Dots</text>
    </svg>
  );
}

export function NfcThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Smartphone Back Outline */}
      <rect x="40" y="30" width="70" height="105" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
      {/* Copper Induction Loop Antenna */}
      <rect x="52" y="55" width="46" height="46" rx="6" fill="none" stroke="#F59E0B" strokeWidth="2" />
      <rect x="56" y="59" width="38" height="38" rx="4" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="75" cy="78" r="4" fill="#38BDF8" />

      {/* 13.56 MHz Magnetic Coupling Induction Waves */}
      <path d="M120,55 Q135,78 120,101" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M128,45 Q148,78 128,111" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2" />

      {/* POS Terminal */}
      <rect x="145" y="45" width="60" height="85" rx="6" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
      <rect x="155" y="55" width="40" height="25" rx="3" fill="#064E3B" />
      <text x="175" y="70" fill="#A7F3D0" fontSize="7" fontWeight="700" textAnchor="middle">PAID ✓</text>
      <circle cx="175" cy="100" r="6" fill="#10B981" />

      <text x="120" y="148" fill="#FDE68A" fontSize="7.5" fontWeight="700" textAnchor="middle">13.56 MHz Near Field Induction</text>
    </svg>
  );
}

/* ── NEW COMPUTING & ELECTRONICS HARDWARE PACK THUMBNAILS ───── */

export function TransistorEuvThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="euvLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Silicon Substrate Base */}
      <rect x="25" y="105" width="190" height="35" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <text x="120" y="127" fill="#64748B" fontSize="8" fontWeight="700" textAnchor="middle">Silicon Wafer (300mm Die)</text>

      {/* 3D GAAFET Nanosheet Ribbons */}
      {[50, 100, 150].map((x, idx) => (
        <g key={idx} transform={`translate(${x}, 45)`}>
          {/* Source/Drain Contacts */}
          <rect x="-10" y="25" width="12" height="35" rx="2" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1" />
          <rect x="38" y="25" width="12" height="35" rx="2" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1" />
          {/* 3 Nanosheet Channels */}
          <rect x="2" y="28" width="36" height="5" rx="1" fill="#38BDF8" />
          <rect x="2" y="38" width="36" height="5" rx="1" fill="#38BDF8" />
          <rect x="2" y="48" width="36" height="5" rx="1" fill="#38BDF8" />
          {/* Gate All Around (GAA) Wrap */}
          <rect x="12" y="18" width="16" height="42" rx="3" fill="#6366F1" fillOpacity="0.4" stroke="#818CF8" strokeWidth="1.5" />
        </g>
      ))}

      {/* 13.5nm EUV Laser Beam */}
      <polygon points="120,5 90,40 150,40" fill="url(#euvLaserGrad)" />
      <line x1="120" y1="5" x2="120" y2="40" stroke="#E879F9" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="120" cy="5" r="4" fill="#E879F9" />

      <text x="120" y="152" fill="#C084FC" fontSize="8" fontWeight="800" textAnchor="middle">13.5nm EUV Photolithography · 3nm GAAFET</text>
    </svg>
  );
}

export function QuantumComputingThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Bloch Sphere Geometry */}
      <circle cx="120" cy="80" r="48" fill="#090E24" stroke="#38BDF8" strokeWidth="2" />
      <ellipse cx="120" cy="80" rx="48" ry="18" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" />
      <ellipse cx="120" cy="80" rx="18" ry="48" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="4 3" />

      {/* Z-Axis Pole Vector */}
      <line x1="120" y1="22" x2="120" y2="138" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="120" cy="32" r="4" fill="#38BDF8" />
      <text x="120" y="24" fill="#38BDF8" fontSize="9" fontWeight="800" textAnchor="middle">|0⟩</text>
      <circle cx="120" cy="128" r="4" fill="#EF4444" />
      <text x="120" y="146" fill="#F87171" fontSize="9" fontWeight="800" textAnchor="middle">|1⟩</text>

      {/* Superposition State Vector |Ψ⟩ */}
      <line x1="120" y1="80" x2="155" y2="55" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="155" cy="55" r="5" fill="#FBBF24" />
      <text x="175" y="55" fill="#FDE68A" fontSize="9" fontWeight="800">|Ψ⟩</text>

      {/* Qubit Superposition Chips on Sides */}
      <rect x="25" y="55" width="35" height="50" rx="4" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
      <text x="42" y="78" fill="#C084FC" fontSize="7" fontWeight="700" textAnchor="middle">Q0</text>
      <text x="42" y="90" fill="#93C5FD" fontSize="6" textAnchor="middle">15 mK</text>

      <rect x="180" y="55" width="35" height="50" rx="4" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
      <text x="197" y="78" fill="#C084FC" fontSize="7" fontWeight="700" textAnchor="middle">Q1</text>
      <text x="197" y="90" fill="#93C5FD" fontSize="6" textAnchor="middle">Hadamard</text>
    </svg>
  );
}

export function MemsSensorThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      <rect x="30" y="25" width="180" height="110" rx="8" fill="#0A0F1D" stroke="#334155" strokeWidth="2" />

      {/* Proof Mass Center Silicon Plate */}
      <rect x="85" y="50" width="70" height="60" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
      <text x="120" y="84" fill="#E0F2FE" fontSize="8.5" fontWeight="800" textAnchor="middle">PROOF MASS</text>

      {/* Interdigitated Capacitive Comb Fingers */}
      {/* Left Static Fingers */}
      {[55, 65, 75, 85, 95].map((y) => (
        <line key={`lf-${y}`} x1="45" y1={y} x2="80" y2={y} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Left Movable Fingers */}
      {[60, 70, 80, 90].map((y) => (
        <line key={`lm-${y}`} x1="70" y1={y} x2="90" y2={y} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      ))}

      {/* Right Movable Fingers */}
      {[60, 70, 80, 90].map((y) => (
        <line key={`rm-${y}`} x1="150" y1={y} x2="170" y2={y} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Right Static Fingers */}
      {[55, 65, 75, 85, 95].map((y) => (
        <line key={`rf-${y}`} x1="160" y1={y} x2="195" y2={y} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      ))}

      {/* Silicon Suspension Spring Coils */}
      <path d="M 120,25 L 115,32 L 125,38 L 115,44 L 120,50" stroke="#34D399" strokeWidth="2" fill="none" />
      <path d="M 120,110 L 115,116 L 125,122 L 115,128 L 120,135" stroke="#34D399" strokeWidth="2" fill="none" />

      <text x="120" y="148" fill="#FDE68A" fontSize="7.5" fontWeight="700" textAnchor="middle">Coriolis &amp; Differential Capacitance (ΔC)</text>
    </svg>
  );
}

export function FiberOpticThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Cladding Outer Pipe */}
      <rect x="25" y="45" width="190" height="70" rx="8" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />
      <text x="45" y="60" fill="#64748B" fontSize="7" fontWeight="600">Silica Cladding (n₂ = 1.45)</text>

      {/* Core Pure Glass Channel */}
      <rect x="25" y="65" width="190" height="30" fill="#0369A1" fillOpacity="0.4" stroke="#0284C7" strokeWidth="1.5" />
      <text x="45" y="83" fill="#BAE6FD" fontSize="7.5" fontWeight="700">Core (n₁ = 1.48)</text>

      {/* Total Internal Reflection Zig-Zag Light Ray */}
      <path
        d="M 25,80 L 60,66 L 105,94 L 150,66 L 195,94 L 215,80"
        stroke="#F59E0B"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Normal Vector Reflection Points */}
      <line x1="60" y1="58" x2="60" y2="74" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="105" y1="86" x2="105" y2="102" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="150" y1="58" x2="150" y2="74" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />

      <text x="120" y="132" fill="#FDE68A" fontSize="8" fontWeight="700" textAnchor="middle">Total Internal Reflection (θ &gt; θc)</text>
      <text x="120" y="145" fill="#94A3B8" fontSize="7" textAnchor="middle">DWDM 96 Channels · 200,000 km/s</text>
    </svg>
  );
}

export function PcbMotherboardThumbnail() {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none">
      {/* Dark Matte Green / Charcoal PCB Substrate */}
      <rect x="25" y="20" width="190" height="120" rx="8" fill="#042F2E" stroke="#0D9488" strokeWidth="2" />

      {/* CPU LGA Socket */}
      <rect x="40" y="35" width="55" height="55" rx="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
      <rect x="48" y="43" width="39" height="39" rx="2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
      <text x="67" y="65" fill="#FDE68A" fontSize="7" fontWeight="800" textAnchor="middle">LGA 1700</text>

      {/* VRM Power Inductors & Caps */}
      <rect x="40" y="98" width="12" height="12" rx="2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
      <rect x="56" y="98" width="12" height="12" rx="2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
      <rect x="72" y="98" width="12" height="12" rx="2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
      <text x="67" y="122" fill="#34D399" fontSize="6" fontWeight="700" textAnchor="middle">16-Phase VRM</text>

      {/* DDR5 Memory DIMM Slots */}
      <rect x="110" y="32" width="6" height="60" rx="1" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
      <rect x="120" y="32" width="6" height="60" rx="1" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
      <rect x="130" y="32" width="6" height="60" rx="1" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
      <rect x="140" y="32" width="6" height="60" rx="1" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

      {/* High-Speed PCIe 5.0 Serpentine Traces */}
      <path
        d="M 95,65 L 115,65 L 118,60 L 122,70 L 126,60 L 130,70 L 155,65 L 195,65"
        stroke="#F59E0B"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 95,72 L 115,72 L 118,67 L 122,77 L 126,67 L 130,77 L 155,72 L 195,72"
        stroke="#F59E0B"
        strokeWidth="1.5"
        fill="none"
      />

      {/* PCIe x16 Slot */}
      <rect x="155" y="95" width="50" height="14" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="180" y="105" fill="#FDE68A" fontSize="6.5" fontWeight="700" textAnchor="middle">PCIe 5.0 x16</text>

      <text x="120" y="132" fill="#5EEAD4" fontSize="7.5" fontWeight="700" textAnchor="middle">Controlled Impedance &amp; Multi-Layer Vias</text>
    </svg>
  );
}

export function TopicThumbnailDispatcher({ slug }: { slug: string }) {
  switch (slug) {
    case "cpu":
      return <CpuThumbnail />;
    case "wifi":
      return <WifiThumbnail />;
    case "camera":
      return <CameraThumbnail />;
    case "ssd":
      return <SsdThumbnail />;
    case "gpu":
      return <GpuThumbnail />;
    case "dns":
      return <DnsThumbnail />;
    case "bluetooth":
      return <BluetoothThumbnail />;
    case "ram":
      return <RamThumbnail />;
    case "battery":
      return <BatteryThumbnail />;
    case "touchscreen":
      return <TouchscreenThumbnail />;
    case "ai-neural":
      return <NeuralThumbnail />;
    case "gps":
      return <GpsThumbnail />;
    case "anc":
      return <AncThumbnail />;
    case "oled":
      return <OledThumbnail />;
    case "face-id":
      return <FaceIdThumbnail />;
    case "nfc":
      return <NfcThumbnail />;
    case "transistor-euv":
      return <TransistorEuvThumbnail />;
    case "quantum-computing":
      return <QuantumComputingThumbnail />;
    case "mems-sensor":
      return <MemsSensorThumbnail />;
    case "fiber-optic":
      return <FiberOpticThumbnail />;
    case "pcb-motherboard":
      return <PcbMotherboardThumbnail />;
    default:
      return <CpuThumbnail />;
  }
}

