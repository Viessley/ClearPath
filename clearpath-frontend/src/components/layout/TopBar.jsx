export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
      <button className="text-gray-500">☰</button>
      <h1 className="text-xl font-bold text-teal-700">
        Clear<span className="text-teal-500">Path</span>
      </h1>
      <div className="flex gap-3 text-gray-500">
        <button>⚙</button>
        <button>👤</button>
      </div>
    </div>
  )
}