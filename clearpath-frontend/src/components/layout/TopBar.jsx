import { HamburgerIcon, SettingsIcon, UserIcon } from "../../icons/System"
import logo from '../../assets/clearpath-logo.png'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
      <button className="text-gray-500"><HamburgerIcon size={22} /></button>
      <img src={logo} alt="ClearPath" style={{ height: 28 }} />
      <div className="flex gap-3 text-gray-500">
        <button><SettingsIcon size={22} /></button>
        <button><UserIcon size={22} /></button>
      </div>
    </div>
  )
}