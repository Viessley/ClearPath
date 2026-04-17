export default function MoonIcon({ size = 24, color = "currentColor" }) {
  return (
    <div className="flex items-center gap-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <span style={{ fontSize: "12px", fontWeight: "600" }}>dark</span>
    </div>
  )
}