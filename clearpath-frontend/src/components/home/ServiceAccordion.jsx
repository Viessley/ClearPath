import { useState } from 'react'
import ServiceItem from './ServiceItem'

export default function ServiceAccordion({ category, items, selected, onToggle }) {
  const [isOpen, setIsOpen] = useState(true)
  
  const selectedCount = items.filter(item => selected[item.id]).length

  return (
    <div className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden">
      
      {/* Header */}
      <button className="w-full flex items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className="text-sm font-semibold text-teal-900">{category}</div>
          {selectedCount > 0 && (
            <div className="text-xs text-teal-600 mt-0.5">
              Select what you need ({selectedCount}/{items.length})
            </div>
          )}
        </div>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
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
          {selectedCount > 0 && (
            <div className="flex justify-end px-4 py-3 border-t border-gray-100">
              <button className="bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-xl">
                Continue ({selectedCount}/{items.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}