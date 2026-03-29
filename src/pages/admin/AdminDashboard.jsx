// Файл: frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Image, DollarSign, FileText, ExternalLink } from 'lucide-react'
import { adminGetVehicles } from '../../services/vehicleService.js'
import { adminGetBanners, getPricingConfig } from '../../services/adminService.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, banners: 0, wonToMNT: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      const [vehiclesRes, bannersRes, pricingRes] = await Promise.allSettled([
        adminGetVehicles({ limit: 1 }),
        adminGetBanners(),
        getPricingConfig(),
      ])
      setStats({
        vehicles: vehiclesRes.status === 'fulfilled' ? vehiclesRes.value.total || 0 : 0,
        banners: bannersRes.status === 'fulfilled' ? bannersRes.value.count || 0 : 0,
        wonToMNT: pricingRes.status === 'fulfilled' ? pricingRes.value.data?.wonToMNT || 0 : 0,
      })
    } catch (err) {
      console.error('❌ Dashboard алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const CARDS = [
    { title: 'Нийт машин', value: stats.vehicles, icon: Car, link: '/admin/vehicles', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { title: 'Banner зургууд', value: stats.banners, icon: Image, link: '/admin/banners', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
    { title: '1₩ = ? ₮', value: stats.wonToMNT ? `${stats.wonToMNT}₮` : '–', icon: DollarSign, link: '/admin/pricing', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
  ]

  const QUICK_LINKS = [
    { label: '+ Шинэ машин нэмэх', to: '/admin/vehicles/new', icon: Car },
    { label: '+ Banner нэмэх', to: '/admin/banners', icon: Image },
    { label: 'Ханш шинэчлэх', to: '/admin/pricing', icon: DollarSign },
    { label: 'Татварын хүснэгт', to: '/admin/tax', icon: FileText },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl">Хяналтын самбар</h1>
          <p className="text-gray-500 text-sm mt-1">SMCar.mn Admin Panel</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded px-3 py-1.5 bg-white"
        >
          <ExternalLink size={13} />
          Сайт харах
        </a>
      </div>

      {/* Статистикийн картнууд */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CARDS.map(card => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                  <p className="text-gray-900 text-3xl font-bold">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`${card.bg} border ${card.color} p-3 rounded-lg`}>
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Хурдан үйлдлүүд */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-gray-900 font-semibold mb-4">Хурдан үйлдлүүд</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 hover:text-gray-900 transition-all"
              >
                <Icon size={14} className="text-primary" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Тайлбар */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-gray-900 font-medium mb-3 text-sm">📋 Хэрхэн ашиглах вэ?</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• <span className="text-gray-900 font-medium">Banner нэмэх:</span> "Banner зургууд" цэсэнд зураг upload хийхэд нүүр хуудаст автоматаар гарна</p>
          <p>• <span className="text-gray-900 font-medium">Машин нэмэх:</span> "Машинууд" цэсэнд гараар машины мэдээлэл, зураг оруулна</p>
          <p>• <span className="text-gray-900 font-medium">Ханш:</span> "Валютын ханш" хэсэгт 1₩ = хэдэн ₮ гэж тохируулна</p>
          <p>• <span className="text-gray-900 font-medium">Татвар:</span> "Татварын хүснэгт" хэсэгт хөдөлгүүр, насаар татварыг тохируулна</p>
        </div>
      </div>
    </div>
  )
}