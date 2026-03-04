import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BottomBar from '../components/layout/BottomBar'
import Mascot from '../components/shared/Mascot'
import ServiceAccordion from '../components/home/ServiceAccordion'

const SERVICES = [
  {
    category: "Ontario Driver Services",
    items: [
      { id: "get-licensed",   icon: "🪪", title: "Get licensed",    subtitle: "Get G1, G2, or full G license" },
      { id: "switch-license", icon: "🔄", title: "Switch licenses", subtitle: "Exchange foreign license" },
      { id: "fix-tickets",    icon: "🎫", title: "Fix tickets",     subtitle: "Pay, reduce, or fight the ticket." },
    ],
  },
  {
    category: "Visa Services",
    items: [
      { id: "study-permit", icon: "📄", title: "Study Permit", subtitle: "Apply or extend your study permit" },
      { id: "work-permit",  icon: "💼", title: "Work Permit",  subtitle: "Open or employer-specific permits" },
    ],
  },
]

export default function HomePage() {
  const [selected, setSelected] = useState({ "get-licensed": true })

  const toggleItem = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <div className="flex-1 px-4 pt-4 pb-32">
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-4">
          <Mascot />
          <p className="text-sm text-gray-500">Welcome, <strong className="text-teal-800">#UserID</strong>! What brings you here?</p>
        </div>

        {/* Services */}
        {SERVICES.map(section => (
          <ServiceAccordion
            key={section.category}
            category={section.category}
            items={section.items}
            selected={selected}
            onToggle={toggleItem}
          />
        ))}
      </div>

      <BottomBar />
    </div>
  )
}