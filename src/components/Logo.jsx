export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hexGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0C848" />
          <stop offset="100%" stopColor="#A08020" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0C848" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Esagono */}
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        fill="url(#hexGrad)"
        fillOpacity="0.12"
        stroke="url(#hexGrad)"
        strokeWidth="1.2"
      />

      {/* Candela 1 — rialzista */}
      <line x1="10" y1="11" x2="10" y2="21" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="8.5" y="13" width="3" height="5" rx="0.5" fill="#D4AF37" />

      {/* Candela 2 — ribassista */}
      <line x1="16" y1="10" x2="16" y2="22" stroke="#888" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="14.5" y="13.5" width="3" height="5.5" rx="0.5" fill="#555" />

      {/* Candela 3 — rialzista grande */}
      <line x1="22" y1="9" x2="22" y2="21" stroke="#F0C848" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="20.5" y="11" width="3" height="7" rx="0.5" fill="url(#lineGrad)" />

      {/* Linea trend */}
      <polyline
        points="10,15 16,16.5 22,13"
        stroke="#F0C848"
        strokeWidth="0.9"
        strokeOpacity="0.6"
        fill="none"
        strokeDasharray="1.5 1"
      />
    </svg>
  )
}
