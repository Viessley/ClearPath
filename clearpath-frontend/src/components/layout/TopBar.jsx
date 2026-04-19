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
  

  return (
    <>
      {/* TopBar */}
      <div className="fixed top-0 left-0 right-0 max-w-sm mx-auto z-50 bg-white border-b border-gray-100 flex items-center justify-between px-5 py-4">
        {localStorage.getItem('token') ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}  
              style={{ fontSize: "13px", fontWeight: "600", color: "#0f766e" }}>
              {localStorage.getItem('nickname') || 'Me'} ▾
            </button>
            {showUserMenu && (
              <div style={{
                position: "absolute",
                top: "28px", left: 0,
                background: "#fff",
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
            style={{ fontSize: "13px", fontWeight: "600", color: "#0f766e" }}>
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
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div>
              <h2>ClearPath Updates</h2>
              <p>Welcome! This page will track our roadmap and ideas. A feedback email is coming soon, which we will review daily. Special thanks to Stephen Gagne (Algonquin College) for 8 months of support in turning ClearPath into reality.</p>
              <h3>Update</h3>
              <p>Update: Google Sign-In is now live. No more passwords — just tap "Continue with Google" and you're in.
                Save your Cheatsheet to your personal account and access it anytime from your Repo.
                As a thank-you to our early adopters: the first 20 users to register get lifetime free access to all future premium features. No catch.</p>

              <p>— Wesley</p>
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
                background: "#0f766e",
                color: "#fff",
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
