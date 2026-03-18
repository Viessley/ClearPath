import { useState } from 'react'
import ServiceItem from './ServiceItem'

export default function ServiceAccordion({ category, bgColor, items, selected, onToggle }) {
  const [isOpen, setIsOpen] = useState(true)

  const selectedCount = items.filter(item => selected[item.id]).length

  return (
    <div className="rounded mb-3 overflow-hidden"
      style={{ background: bgColor, boxShadow: "0px 4px 4px rgba(0,0,0,0.25)", borderRadius: 5 }}>

      {/* Header */}
      <button className="w-full flex items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className="font-semibold" style={{ color: "#111827", fontSize: 16, letterSpacing: "-0.02em" }}>{category}</div>

          <div className="mt-0.5" style={{ color: "#111827", fontSize: 14 }}>
            Select what you need ({selectedCount}/{items.length})
          </div>

        </div>
        <span style={{ color: "#5B9D93" }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Items */}
      {isOpen && (
        <div>
          {items.map(item => (
            <ServiceItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              checked={!!selected[item.id]}
              onToggle={() => onToggle(item.id)}
            />
          ))}

          {/* Continue Button */}
          <div className="flex justify-end px-4 py-3">
            <button
              disabled={selectedCount === 0}
              className="text-sm font-semibold px-5 py-2"
              style={{
                background: selectedCount > 0 ? "#5B9D93" : "#9CA3AF",
                color: "#F5EFF7",
                borderRadius: 12,
                boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                cursor: selectedCount > 0 ? "pointer" : "not-allowed",
                opacity: selectedCount > 0 ? 1 : 0.7
              }}>
              Continue ({selectedCount}/{items.length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}