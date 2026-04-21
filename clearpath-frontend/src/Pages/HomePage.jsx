import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BottomBar from '../components/layout/BottomBar'
import Mascot from '../components/shared/Mascot'
import ServiceAccordion from '../components/home/ServiceAccordion'
import { GetLicensedIcon, SwitchLicensesIcon, FixTicketsIcon, StudyPermitIcon, WorkPermitIcon } from '../icons/Service'

const HAS_NEW_ANNOUNCEMENT = true

const SERVICES = [
  {
    category: "Ontario Driver Services",
    bgColor: "var(--bg-accent)",
    items: [
      { id: "get-licensed", icon: <GetLicensedIcon />, title: "Get licensed", subtitle: "Get G1, G2, or full G license" },
      { id: "switch-license", icon: <SwitchLicensesIcon />, title: "Switch licenses", subtitle: "Exchange foreign license" },
      { id: "fix-tickets", icon: <FixTicketsIcon />, title: "Fix tickets", subtitle: "Pay, reduce, or fight the ticket." },
    ],
  },
  
]

export default function HomePage() {
  const [selected, setSelected] = useState({ "get-licensed": true })

  const toggleItem = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <div className="flex-1 px-4 pt-4 pb-32">
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-4">
          <Mascot />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Welcome, <strong style={{ color: "var(--text-primary)" }}>{localStorage.getItem('nickname')}</strong>! What brings you here?
          </p>
        </div>

        {/* Services */}
        {SERVICES.map(section => (
          <ServiceAccordion
            key={section.category}
            category={section.category}
            bgColor={section.bgColor}
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