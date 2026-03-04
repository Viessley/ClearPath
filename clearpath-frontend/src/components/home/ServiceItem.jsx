export default function ServiceItem({ icon, title, subtitle, checked, onToggle }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 cursor-pointer hover:bg-gray-50"
      onClick={onToggle}>
      <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      </div>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0
        ${checked ? 'bg-teal-700 border-teal-700' : 'border-gray-300 bg-white'}`}>
        {checked && <span className="text-white text-xs">✓</span>}
      </div>
    </div>
  )
}