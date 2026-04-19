import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'

export default function KitViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [kit, setKit] = useState(null)
  const [sections, setSections] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://clearpath-backend-sc9k.onrender.com/api/kits/${id}`)
      .then(res => res.json())
      .then(data => {
        setKit(data)
        if (data.content) {
          setSections(JSON.parse(data.content))
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center"><p className="text-sm text-gray-500">Loading...</p></div>

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-accent-light)" }}>
      <TopBar />
      <div className="flex-1 px-4 pt-4 pb-32">
        <h1 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>{kit?.title}</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>#{kit?.id} · Saved {kit?.createdAt?.slice(0, 10)}</p>
        
        {sections ? (
          <div className="flex flex-col gap-4">
            {sections.summary && <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)" }}><h3 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>Summary</h3><p className="text-sm">{sections.summary}</p></div>}
            {sections.requirements && <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)" }}><h3 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>Requirements</h3><p className="text-sm">{sections.requirements}</p></div>}
            {sections.steps && <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)" }}><h3 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>Your Steps</h3><p className="text-sm">{sections.steps}</p></div>}
            {sections.cost && <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)" }}><h3 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>Cost</h3><p className="text-sm">{sections.cost}</p></div>}
            {sections.tips && <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--tip-border)", backgroundColor: "#FFFBEB" }}><h3 className="text-sm font-bold mb-2" style={{ color: "var(--tip-text)" }}>Tips</h3><p className="text-sm">{sections.tips}</p></div>}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No content available.</p>
        )}
        <button onClick={() => navigate(-1)} className="mt-6 text-sm" style={{ color: "var(--accent-dark)" }}>← Back</button>
      </div>
    </div>
  )
}