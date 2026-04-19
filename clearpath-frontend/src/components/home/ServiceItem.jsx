export default function ServiceItem({ icon, title, subtitle, checked, onToggle }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
      style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-color)" }}
      onClick={onToggle}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--bg-accent-light)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 16, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--text-primary)" }} className="mt-0.5">{subtitle}</div>
      </div>
      <div className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 18, height: 18, borderRadius: 2,
          background: checked ? "var(--accent)" : "transparent",
          border: checked ? "none" : "2px solid var(--accent)"
        }}>
        {checked && <span style={{ color: "#FFFFFF", fontSize: 12 }}>✓</span>}
      </div>
    </div>
  )
}