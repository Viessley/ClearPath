export default function Mascot() {
  return (
    <div style={{ width: 44, height: 44, flexShrink: 0 }}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}>
        <line x1="40" y1="8" x2="40" y2="18" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="40" cy="6" r="4" fill="#0f766e"/>
        <rect x="16" y="18" width="48" height="38" rx="12" fill="#ccfbf1" stroke="#0f766e" strokeWidth="2.5"/>
        <circle cx="29" cy="33" r="6" fill="#0f766e"/>
        <circle cx="51" cy="33" r="6" fill="#0f766e"/>
        <circle cx="31" cy="31" r="2" fill="white"/>
        <circle cx="53" cy="31" r="2" fill="white"/>
        <path d="M30 44 Q35 41 40 44 Q45 41 50 44" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <rect x="24" y="56" width="32" height="16" rx="6" fill="#99f6e4" stroke="#0f766e" strokeWidth="2"/>
        <circle cx="40" cy="64" r="4" fill="#0f766e" opacity="0.6"/>
      </svg>
    </div>
  )
}