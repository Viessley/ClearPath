import { CameraIcon, RepoIcon } from '../../icons/System'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BottomBar() {

  const navigate = useNavigate()

  const [showRepo, setShowRepo] = useState(false)
  const [kits, setKits] = useState([])
  const [selected, setSeleted] = useState([])
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
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-100 max-w-sm mx-auto px-10" style={{ height: "60px" }}>

        {/* Camera */}
        <button className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-teal-700">
          <CameraIcon size={22} />
          <span style={{ fontSize: "10px" }}>Camera</span>
        </button>

        {/* Repo */}
        <button
          onClick={() => { setShowRepo(true); fetchKits(); }}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-teal-700">
          <RepoIcon size={22} />
          <span style={{ fontSize: "10px" }}>Reports</span>
        </button>

      </div>

      {/* Repo Drawer */}
      {showRepo && (
        <>
          <div
            onClick={() => setShowRepo(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 998,
            }}
          />
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
                  onClick={() => { setShowRepo(false); navigate('/kit/' + kit.id); }}
                  style={{
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px", borderRadius: "12px",
                    border: "1px solid #e5e7eb", marginBottom: "8px",
                    backgroundColor: selected.includes(kit.id) ? "var(--bg-page)" : "var(--bg-card)"
                  }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(kit.id)}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(kit.id); }}
                  />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600" }}>{kit.title}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      #CP{kit.id} · {kit.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                </div>
              ))
            )}

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
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                    This cannot be undone.
                  </p>
                  <button onClick={deleteSelected}
                    style={{ width: "100%", padding: "12px", background: "#ef4444", color: "#fff", borderRadius: "12px", fontWeight: "600", marginBottom: "8px" }}>
                    Yes, delete
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    style={{ width: "100%", padding: "12px", color: "var(--text-muted)", fontSize: "13px" }}>
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