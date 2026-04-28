import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ============================================================
// ✏️  WESLEY — EDIT HERE
// ============================================================
const ANNOUNCEMENT = {
  lastUpdated: "April 28, 2026",
  badge: "Beta",
  title: "ClearPath is in active development 🚧",
  body: `Welcome! This page will track our roadmap and ideas. A feedback email is coming soon, which we will review daily. Special thanks to Stephen Gagne (Algonquin College) for 8 months of support in turning ClearPath into reality.

─────────────────────────
What works right now
─────────────────────────
Decision Tree (Briefing) — Live and working. Answer a few questions about your situation and ClearPath figures out your path. Covers age, immigration status, foreign license, and 20+ branches.

AI Chat — Live. If you hit a question you're not sure about, the AI steps in to help clarify and get you back on track. Now powered by Claude Haiku 4.5 — noticeably faster than before.

Google Sign-In — Live. No password needed. Tap "Continue with Google" and you're in.

Quiz Hub — Live. G1 practice questions to help you prep for the knowledge test.

Repo (Kit saving) — Live. Save your Cheatsheet to your account and access it anytime.

─────────────────────────
What doesn't work yet
─────────────────────────
Cheatsheet (Survival Kit) — Partially working. The AI generates your personalized action plan at the end of the decision tree, but the layout and content still need work. Consider it a rough draft.

Game Plan — In development. Step-by-step tracking inside your saved Kit is not connected yet.

Camera / Voice input — UI is there, functionality is not built yet.

Coverage — Right now ClearPath only covers Ontario driver's license guidance. More services are coming.

─────────────────────────
Known issues
─────────────────────────
- AI responses occasionally go off-topic when the situation involves immigration questions (Study Permit, etc.). We're fixing the scope boundaries.
- The app is optimized for mobile. Desktop layout is functional but not polished.
- First load can be slow — the backend is on a free server that sleeps when idle. Give it 10–15 seconds on first visit.

─────────────────────────
What's coming
─────────────────────────
- Proper Cheatsheet rendering with structured steps, documents, fees, and tips
- AI scope fixes — better handoff to the right resources when your situation is outside our lane
- More decision tree coverage (Study Permit extension, G2/G, more)
- PDF export for your Survival Kit
- French language support

─────────────────────────
Early adopter offer
─────────────────────────
The first 20 users to register get lifetime free access to all future premium features. No catch. We mean it.

— Wesley`,
  contact: {
    label: "If you're having a bad day, send us hate mail",
    email: "clearpathwesley@gmail.com",
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
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-teal-100">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium"
          style={{ color: "var(--accent-dark)" }}
        >
          ← Back
        </button>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Updates
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 pb-24 flex flex-col gap-5">

        {/* Badge + date */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#ccfbf1", color: "var(--accent-dark)" }}
          >
            {ANNOUNCEMENT.badge}
          </span>
          <span className="text-xs" style={{ color: "#var(--text-muted)" }}>
            Last updated: {ANNOUNCEMENT.lastUpdated}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
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
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {ANNOUNCEMENT.contact.label}
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: copied ? "#ccfbf1" : "var(--bg-card)",
              border: "1px solid",
              borderColor: copied ? "#2dd4bf" : "#var(--border-light)",
              color: copied ? "#var(--accent-dark)" : "#var(--text-primary)",
            }}
          >
            <span>{ANNOUNCEMENT.contact.email}</span>
            <span className="text-xs ml-3" style={{ color: copied ? "#var(--accent-dark)" : "var(--text-muted)" }}>
              {copied ? "✓ Copied!" : "Copy"}
            </span>
          </button>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Tell us ClearPath is stupid. It might help. We read everything.
          </p>
        </div>
      </div>
    </div>
  )
}