// Файл: frontend/src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Нүүр хуудас' },
    { to: '/vehicles', label: 'Машинууд' },
    { to: '/#how', label: 'Захиалга' },
  ]

  return (
    <nav className="bg-dark-secondary border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Лого */}
        <Link to="/" className="font-display text-2xl tracking-wider">
          <span className="text-white">SMCAR</span>
          <span className="text-primary">.MN</span>
        </Link>

        {/* Desktop навигаци */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-primary font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu товч */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark-secondary px-4 py-3 space-y-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-400 hover:text-white py-1.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}