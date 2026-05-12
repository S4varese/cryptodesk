export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#1a56ff"/>
      <circle cx="16" cy="16" r="9" stroke="white" strokeWidth="1.8"/>
      <line x1="16" y1="7" x2="16" y2="11" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="16" y2="25" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="7" y1="16" x2="11" y2="16" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="21" y1="16" x2="25" y2="16" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="19.5" y1="19.5" x2="22.5" y2="22.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="22.5" y1="9.5" x2="19.5" y2="12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="9.5" y1="22.5" x2="12.5" y2="19.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="3.5" stroke="white" strokeWidth="1.6"/>
      <circle cx="16" cy="16" r="1.5" fill="white"/>
    </svg>
  )
}
