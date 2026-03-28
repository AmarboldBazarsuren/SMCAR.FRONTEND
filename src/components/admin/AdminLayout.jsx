// Файл: frontend/src/components/admin/AdminLayout.jsx
// Үүрэг: Admin panel-ийн sidebar навигаци + үндсэн layout

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, Car, DollarSign, FileText, LogOut, ChevronRight } from 'lucide-react'

const MENU = [
  { path: '/admin', label: 'Хяналтын самбар', icon: LayoutDashboard, exact: true },
  { path: '/admin/banners', label: 'Banner зургууд', icon: Image },
  { path: '/admin/vehicles', label: 'Машинууд', icon: Car },
  { path: '/admin/pricing', label: 'Валютын ханш', icon: DollarSign },
  { path: '/admin/tax', label: 'Татварын хүснэгт', icon: FileText },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    console.log('👋 Admin гарлаа')
    navigate('/admin/login')
  }

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-secondary border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Лого */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="font-display text-xl tracking-wider">
            <span className="text-white">SMCAR</span>
            <span className="text-primary">.MN</span>
          </Link>
          <p className="text-gray-500 text-xs mt-1">Admin Panel</p>
        </div>

        {/* Admin мэдээлэл */}
        <div className="px-5 py-3 border-b border-white/5">
          <p className="text-white text-sm font-medium">{adminInfo.name || 'Admin'}</p>
          <p className="text-gray-500 text-xs">{adminInfo.email}</p>
        </div>

        {/* Навигаци */}
        <nav className="flex-1 py-4">
          {MENU.map(item => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Нүүр хуудас руу очих */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors px-1"
          >
            🌐 Сайт харах
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm transition-colors w-full px-1"
          >
            <LogOut size={14} />
            Гарах
          </button>
        </div>
      </aside>

      {/* Үндсэн контент */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}