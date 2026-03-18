export default function ServiceItem({ icon, title, subtitle, checked, onToggle }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
      style={{ background: "#FFFFFF", borderTop: "1px solid #A8D5CF" }}
      onClick={onToggle}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#f0fdf9" }}>
        {icon}
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 16, letterSpacing: "-0.02em", color: "#000000" }}>{title}</div>
        <div style={{ fontSize: 14, color: "#000000" }} className="mt-0.5">{subtitle}</div>
      </div>
      <div className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 18, height: 18, borderRadius: 2,
          background: checked ? "#5B9D93" : "transparent",
          border: checked ? "none" : "2px solid #5B9D93"
        }}>
        {checked && <span style={{ color: "#FFFFFF", fontSize: 12 }}>✓</span>}
      </div>
    </div>
  )
}