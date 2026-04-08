import { HamburgerIcon, AnnouncementIcon, RepoIcon } from "../../icons/System"
import { useState } from 'react'
import logo from '../../assets/clearpath-logo.png'


export default function TopBar() {

  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [hasNew, setHasNew] = useState(() => {
    return localStorage.getItem('announcementSeen') !== 'true'
  })

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">

        <button className="text-gray-500"><HamburgerIcon size={22} /></button>
        <img src={logo} alt="ClearPath" style={{ height: 28 }} />
        <div className="flex gap-3 text-gray-500">
          <button onClick={() => setShowAnnouncement(true)}>
            <AnnouncementIcon showDot={hasNew} />
          </button>
          <button onClick={() => navigate('/repo')}><RepoIcon /></button>
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

                <h3>Update</h3>
                <p>Report saving is coming to CheatSheetPage! The current free AI API key is maxed out (short on funds), so I’m swapping in a backup free key to test the save functionality. If all goes well, you'll be able to save CheatSheets to your personal account in a few hours. Thanks for understanding.</p>
                <p>Notice: From now until midnight, all generated CheatSheet reports will consist of pre-set placeholder text for testing purposes. These are not real results—please do not rely on them until the update is complete.</p>
                <h3>Vision</h3>
                <p>Government transparency is valuable but often brings hassle. ClearPath exists to ease those headaches for you, leaving the strict administration to the government.</p>

                <p>— Wesley</p></div>
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

      </div>
    </>
  )
}