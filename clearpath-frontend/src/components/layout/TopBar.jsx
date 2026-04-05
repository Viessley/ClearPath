import { HamburgerIcon, AnnouncementIcon, UserIcon } from "../../icons/System"
import { useState } from 'react'
import logo from '../../assets/clearpath-logo.png'


export default function TopBar() {

  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [hasNew, setHasNew] = useState(true)

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">

        <button className="text-gray-500"><HamburgerIcon size={22} /></button>
        <img src={logo} alt="ClearPath" style={{ height: 28 }} />
        <div className="flex gap-3 text-gray-500">
          <button onClick={() => setShowAnnouncement(true)}>
            <AnnouncementIcon showDot={hasNew} />
          </button>
          <button><UserIcon size={22} /></button>
        </div>

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
              <div><h2>ClearPath Updates</h2>
                <p>Welcome! This page will track our roadmap and ideas. A feedback email is coming soon, which we will review daily. Special thanks to Stephen Gagne (Algonquin College) for 8 months of support in turning ClearPath into reality.</p>

                <h3>Next Steps</h3>
                <ul>
                  <li><strong>Speed & Save:</strong> Faster CheatSheets that you can save.</li>
                  <li><strong>The "Survival Kit":</strong> Upgrading the CheatSheet to include essential docs that help you bypass frustrating traps and confusing processes.</li>
                </ul>

                <h3>Vision</h3>
                <p>Government transparency is valuable but often brings hassle. ClearPath exists to ease those headaches for you, leaving the strict administration to the government.</p>

                <p>— Wesley</p></div>
              <button onClick={() => {
                setShowAnnouncement(false)
                setHasNew(false)
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

      </div>
    </>
  )
}