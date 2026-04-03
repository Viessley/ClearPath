import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import Mascot from '../components/shared/Mascot'
import ServiceAccordion from '../components/home/ServiceAccordion'
import { GetLicensedIcon, SwitchLicensesIcon, FixTicketsIcon, StudyPermitIcon, WorkPermitIcon } from '../icons/Service'



const SERVICES = [
  {
    category: "Ontario Driver Services",
    bgColor: "#D1EDE9",
    items: [
      { id: "get-licensed", icon: <GetLicensedIcon />, title: "Get licensed", subtitle: "Get G1, G2, or full G license" },
      { id: "switch-license", icon: <SwitchLicensesIcon />, title: "Switch licenses", subtitle: "Exchange foreign license" },
      { id: "fix-tickets", icon: <FixTicketsIcon />, title: "Fix tickets", subtitle: "Pay, reduce, or fight the ticket." },
    ],
  },
  {
    category: "Visa Services",
    bgColor: "#E3F2FD",
    items: [
      { id: "study-permit", icon: <StudyPermitIcon />, title: "Study Permit", subtitle: "Apply or extend your study permit" },
      { id: "work-permit", icon: <WorkPermitIcon />, title: "Work Permit", subtitle: "Open or employer-specific permits" },
    ],
  },
]

export default function HomePage() {
  const [selected, setSelected] = useState({ "get-licensed": true })

  const toggleItem = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "#f0f9f8" }}>
      <TopBar />

      <div className="flex-1 px-4 pt-4 pb-32">
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-4">
          <Mascot />
          <p className="text-sm" style={{ color: "#4B5563" }}>
            Welcome, <strong style={{ color: "#111827" }}>#UserID</strong>! What brings you here?
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

    
    </div>
  )
}