import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BottomBar from '../components/layout/BottomBar'
import { G1QuizIcon, M1QuizIcon } from '../icons/Service'

export default function QuizHubPage() {
  const navigate = useNavigate()
  const [showComingSoon, setShowComingSoon] = useState(false)

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <main className="flex-1 px-4 pt-20 pb-32 flex flex-col gap-4">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Practice Quiz</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Choose a quiz to start studying</p>
        </div>

        {/* G1 Quiz Card */}
        <div
          onClick={() => navigate('/quiz')}
          className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:opacity-80"
          style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--border-color)" }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-accent)" }}>
            <span style={{ fontSize: 28 }}><G1QuizIcon/></span>
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>G1 Knowledge Test</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Ontario car & truck licence</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>60 questions available →</p>
          </div>
        </div>

        {/* M1 Quiz Card — Coming Soon */}
        <div
          onClick={() => setShowComingSoon(true)}
          className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:opacity-80"
          style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--border-light)", opacity: 0.6 }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-accent)" }}>
            <span style={{ fontSize: 28 }}><M1QuizIcon/></span>
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>M1 Knowledge Test</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Ontario motorcycle licence</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>Not soon, but will.</p>
          </div>
        </div>

      </main>

      {/* Coming Soon Toast */}
      {showComingSoon && (
        <div
          onClick={() => setShowComingSoon(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", zIndex: 999,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            paddingBottom: "80px"
          }}>
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "16px",
            padding: "20px 24px",
            width: "calc(100% - 48px)",
            maxWidth: "320px",
            textAlign: "center"
          }}>
            <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>M1 Quiz</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Not soon, but will.</p>
          </div>
        </div>
      )}

      <BottomBar />
    </div>
  )
}