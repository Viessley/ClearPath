export default function AnnouncementIcon({ showDot = true}) {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Speaker */}
        <path
          d="M4 9H7L13 5V19L7 15H4C3.45 15 3 14.55 3 14V10C3 9.45 3.45 9 4 9Z"
          stroke="#0f766e"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Wave */}
        <path
          d="M16 8.5C17.5 9.5 17.5 14.5 16 15.5"
          stroke="#0f766e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Red Dot */}
      {showDot && (
        <span style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ef4444",
          border: "1.5px solid #f0f9f8",
        }} />
      )}
    </div>
  )
}