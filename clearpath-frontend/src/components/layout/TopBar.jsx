import { HamburgerIcon, AnnouncementIcon, RepoIcon } from "../../icons/System"
import { useState } from 'react'
import logo from '../../assets/clearpath-logo.png'

export default function TopBar() {

  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [hasNew, setHasNew] = useState(() => {
    return localStorage.getItem('announcementSeen') !== 'true'
  })

  const [showRepo, setShowRepo] = useState(false)
  const [kits, setKits] = useState([])
  const [selected, setSelected] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function fetchKits() {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const res = await fetch(`https://clearpath-backend-sc9k.onrender.com/api/kits/list/${userId}`)
    const data = await res.json()
    setKits(data)
  }

  function toggleSelect(kitId) {
    setSelected(prev =>
      prev.includes(kitId) ? prev.filter(id => id !== kitId) : [...prev, kitId]
    )
  }

  async function deleteSelected() {
    for (const kitId of selected) {
      await fetch(`https://clearpath-backend-sc9k.onrender.com/api/kits/${kitId}`, {
        method: 'DELETE'
      })
    }
    setSelected([])
    setShowDeleteConfirm(false)
    fetchKits()
  }

  return (
    <>
      {/* TopBar 主体 */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <button className="text-gray-500"><HamburgerIcon size={22} /></button>
        <img src={logo} alt="ClearPath" style={{ height: 28 }} />
        <div className="flex gap-3 text-gray-500">
          <button onClick={() => setShowAnnouncement(true)}>
            <AnnouncementIcon showDot={hasNew} />
          </button>
          <button onClick={() => { setShowRepo(true); fetchKits(); }}>
            <RepoIcon />
          </button>
        </div>
      </div>

      {/* 公告弹窗 */}
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
              <p>Report saving is coming to CheatSheetPage! The current free AI API key is maxed out (short on funds), so I'm swapping in a backup free key to test the save functionality. If all goes well, you'll be able to save CheatSheets to your personal account in a few hours. Thanks for understanding.</p>
              <p>Notice: From now until midnight, all generated CheatSheet reports will consist of pre-set placeholder text for testing purposes. These are not real results—please do not rely on them until the update is complete.</p>
              <h3>Vision</h3>
              <p>Government transparency is valuable but often brings hassle. ClearPath exists to ease those headaches for you, leaving the strict administration to the government.</p>
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

      {/* Repo rightside drawer */}
      {showRepo && (
        <>
          {/* cover */}
          <div
            onClick={() => setShowRepo(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 998,
            }}
          />
          {/* drawer */}
          <div style={{
            position: "fixed",
            top: 0, right: 0, bottom: 0,
            width: "80%",
            maxWidth: "320px",
            background: "#fff",
            zIndex: 999,
            padding: "24px 16px",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700" }}>My Repo</h2>
              {selected.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ fontSize: "13px", color: "#ef4444", fontWeight: "600" }}>
                  Delete ({selected.length})
                </button>
              )}
            </div>

            {kits.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#6B7280" }}>No saved reports yet.</p>
            ) : (
              kits.map(kit => (
                <div key={kit.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px", borderRadius: "12px",
                    border: "1px solid #e5e7eb", marginBottom: "8px",
                    backgroundColor: selected.includes(kit.id) ? "#f0f9f8" : "#fff"
                  }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(kit.id)}
                    onChange={() => toggleSelect(kit.id)}
                  />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600" }}>{kit.title}</p>
                    <p style={{ fontSize: "12px", color: "#6B7280" }}>
                      #CP{kit.id} · {kit.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* 二次确认删除 */}
            {showDeleteConfirm && (
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "24px"
              }}>
                <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", width: "100%" }}>
                  <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>
                    Delete {selected.length} report{selected.length > 1 ? "s" : ""}?
                  </p>
                  <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>
                    This cannot be undone.
                  </p>
                  <button onClick={deleteSelected}
                    style={{ width: "100%", padding: "12px", background: "#ef4444", color: "#fff", borderRadius: "12px", fontWeight: "600", marginBottom: "8px" }}>
                    Yes, delete
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    style={{ width: "100%", padding: "12px", color: "#6B7280", fontSize: "13px" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
