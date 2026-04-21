export default function QuizIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="19" height="19" rx="4" stroke="#5B9D93" strokeWidth="1.8"/>
      <line x1="5" y1="7" x2="12" y2="7" stroke="#5B9D93" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="5" y1="11" x2="10" y2="11" stroke="#5B9D93" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="5" y1="15" x2="9" y2="15" stroke="#5B9D93" strokeWidth="1.6" strokeLinecap="round"/>
      <polyline points="10,13 13,17 19,8" stroke="#5B9D93" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

