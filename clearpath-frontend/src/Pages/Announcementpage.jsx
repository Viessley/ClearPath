import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ============================================================
// ✏️  WESLEY — EDIT HERE
// ============================================================
const ANNOUNCEMENT = {
  lastUpdated: "April 5, 2026",
  badge: "Beta",                         // e.g. "Beta" | "v0.2" | "Live"
  title: "ClearPath is in active development 🚧",
  body: `Hey there — thanks for checking out ClearPath early.

We're currently building out Phase 1: Ontario Driver's License guidance. 
The Briefing (decision tree) is live. The Survival Kit is coming soon.

Things may break. Flows may change. That's the beauty of beta.

If something doesn't work, or you have a suggestion — reach out. 
Every message gets read.`,
  contact: {
    label: "Contact the dev",
    email: "hello@clearpath.placeholder",   // 🔁 Replace when ready
  },
}
// ============================================================

export default function AnnouncementPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(ANNOUNCEMENT.contact.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "#f0f9f8" }}>

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-teal-100">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium"
          style={{ color: "#0f766e" }}
        >
          ← Back
        </button>
        <span className="text-sm font-semibold" style={{ color: "#111827" }}>
          Updates
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 pb-24 flex flex-col gap-5">

        {/* Badge + date */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            {ANNOUNCEMENT.badge}
          </span>
          <span className="text-xs" style={{ color: "#6B7280" }}>
            Last updated: {ANNOUNCEMENT.lastUpdated}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold leading-snug" style={{ color: "#111827" }}>
          {ANNOUNCEMENT.title}
        </h1>

        {/* Divider */}
        <div style={{ height: "1px", background: "#d1faf4" }} />

        {/* Body */}
        <p
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{ color: "#374151" }}
        >
          {ANNOUNCEMENT.body}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "#d1faf4" }} />

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>
            {ANNOUNCEMENT.contact.label}
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: copied ? "#ccfbf1" : "#ffffff",
              border: "1px solid",
              borderColor: copied ? "#2dd4bf" : "#e5e7eb",
              color: copied ? "#0f766e" : "#111827",
            }}
          >
            <span>{ANNOUNCEMENT.contact.email}</span>
            <span className="text-xs ml-3" style={{ color: copied ? "#0f766e" : "#9CA3AF" }}>
              {copied ? "✓ Copied!" : "Copy"}
            </span>
          </button>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Tap to copy email address
          </p>
        </div>

      </div>
    </div>
  )
}

