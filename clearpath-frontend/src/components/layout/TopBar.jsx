import { AnnouncementIcon, SunIcon, MoonIcon } from "../../icons/System"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/clearpath-logo.png'

export default function TopBar() {

  const navigate = useNavigate()
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [hasNew, setHasNew] = useState(() => {
    return localStorage.getItem('announcementSeen') !== 'true'
  })

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDarkMode(saved)
    document.documentElement.classList.toggle('dark', saved)
  }, [])


  return (
    <>
      {/* TopBar */}
      <div className="fixed top-0 left-0 right-0 max-w-[480px] mx-auto z-50 flex items-center justify-between px-5 py-4"
  style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-light)" }}>
        {localStorage.getItem('token') ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-dark)" }}>
              {localStorage.getItem('nickname') || 'Me'} ▾
            </button>
            {showUserMenu && (
              <div style={{
                position: "absolute",
                top: "28px", left: 0,
                background: "var(--bg-card)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px",
                zIndex: 100,
                minWidth: "120px"
              }}>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userId')
                    localStorage.removeItem('nickname')
                    setShowUserMenu(false)
                    navigate('/')
                  }}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px", color: "#ef4444", textAlign: "left" }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-dark)" }}>
            Sign in
          </button>
        )}
        <img src={logo} alt="ClearPath" style={{ height: 28, cursor: "pointer" }} onClick={() => navigate("/")} />
        <div className="flex gap-3 items-center text-gray-500">
          <button onClick={() => setShowAnnouncement(true)}>
            <AnnouncementIcon showDot={hasNew} />
          </button>
          <button
            onClick={() => {
              const next = !darkMode;
              setDarkMode(next);
              localStorage.setItem('darkMode', next ? 'true' : 'false');
              document.documentElement.classList.toggle('dark', next);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* Announcment */}
      {showAnnouncement && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }}>
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text-primary)" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>ClearPath Updates</h2>
              <p style={{ marginBottom: "12px", color: "var(--text-muted)", fontSize: "13px" }}>Last updated: April 28, 2026</p>
              <p style={{ marginBottom: "16px" }}>Welcome! This page will track our roadmap and ideas. A feedback email is coming soon, which we will review daily. Special thanks to Stephen Gagne (Algonquin College) for 8 months of support in turning ClearPath into reality.</p>

              <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>✅ What works right now</h3>
              <p style={{ marginBottom: "4px" }}><strong>Decision Tree</strong> — Live. 20+ branches covering age, immigration status, and foreign license.</p>
              <p style={{ marginBottom: "4px" }}><strong>AI Chat</strong> — Live. Powered by Claude Haiku 4.5. Faster than before.</p>
              <p style={{ marginBottom: "4px" }}><strong>Google Sign-In</strong> — Live. No password needed.</p>
              <p style={{ marginBottom: "4px" }}><strong>Quiz Hub</strong> — Live. G1 practice questions.</p>
              <p style={{ marginBottom: "16px" }}><strong>Repo (Kit saving)</strong> — Live. Save and access your Cheatsheet anytime.</p>

              <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>🚧 Not ready yet</h3>
              <p style={{ marginBottom: "4px" }}><strong>Cheatsheet</strong> — Partially working. Content is rough, layout needs work.</p>
              <p style={{ marginBottom: "4px" }}><strong>Game Plan</strong> — In development. Step tracking not connected yet.</p>
              <p style={{ marginBottom: "4px" }}><strong>Camera / Voice</strong> — UI only. Not functional yet.</p>
              <p style={{ marginBottom: "16px" }}><strong>Coverage</strong> — Ontario driver's license only for now. More coming.</p>

              <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>⚠️ Known issues</h3>
              <p style={{ marginBottom: "4px" }}>— AI occasionally goes off-topic on Study Permit questions. Being fixed.</p>
              <p style={{ marginBottom: "4px" }}>— Desktop layout works but isn't polished yet.</p>
              <p style={{ marginBottom: "16px" }}>— First load can be slow (free server sleeps when idle). Give it 10–15 seconds.</p>

              <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>🔜 Coming soon</h3>
              <p style={{ marginBottom: "4px" }}>— Better Cheatsheet with steps, documents, fees, and tips</p>
              <p style={{ marginBottom: "4px" }}>— PDF export for your Survival Kit</p>
              <p style={{ marginBottom: "4px" }}>— More coverage (Study Permit, G2/G, and more)</p>
              <p style={{ marginBottom: "16px" }}>— French language support</p>

              <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>🎁 Early adopter offer</h3>
              <p style={{ marginBottom: "16px" }}>The first 20 users to register get lifetime free access to all future premium features. No catch. We mean it.</p>

              <p style={{ marginBottom: "4px" }}>If you're having a bad day, email us and tell us ClearPath is stupid. It might help.</p>
              <p style={{ marginBottom: "0", fontWeight: "600" }}>clearpathwesley@gmail.com</p>

              <p style={{ marginTop: "16px", color: "var(--text-muted)", fontSize: "13px" }}>— Wesley</p>
            </div>
            <button onClick={() => {
              setShowAnnouncement(false)
              setHasNew(false)
              localStorage.setItem('announcementSeen', 'true')
            }}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px",
                background: "var(--accent-dark)",
                color: "var(--bg-card)",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px"
              }}>
              Got it! →
            </button>
          </div>
        </div>
      )}

    </>
  )
}