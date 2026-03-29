// Файл: frontend/src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/logo_last.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Нүүр хуудас' },
    { to: '/vehicles', label: 'Машинууд' },
    { to: '/#how', label: 'Захиалга' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Лого */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="SMCar.mn"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop навигаци */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-primary font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu товч */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-500 hover:text-gray-900"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-500 hover:text-gray-900 py-1.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}