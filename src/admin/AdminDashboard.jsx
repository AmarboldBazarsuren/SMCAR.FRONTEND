// Файл: frontend/src/pages/admin/AdminDashboard.jsx
// Үүрэг: Admin панелийн нүүр хуудас - ерөнхий мэдээлэл

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Image, DollarSign, FileText, ExternalLink } from 'lucide-react'
import { adminGetVehicles } from '../../services/vehicleService.js'
import { adminGetBanners, getPricingConfig } from '../../services/adminService.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, banners: 0, wonToMNT: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    console.log('📊 Dashboard статистик ачааллаж байна...')
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
      console.log('✅ Dashboard статистик ачааллаа')
    } catch (err) {
      console.error('❌ Dashboard ачааллахад алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const CARDS = [
    {
      title: 'Нийт машин',
      value: stats.vehicles,
      icon: Car,
      link: '/admin/vehicles',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      title: 'Banner зургууд',
      value: stats.banners,
      icon: Image,
      link: '/admin/banners',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: '1₩ = ? ₮',
      value: stats.wonToMNT ? `${stats.wonToMNT}₮` : '–',
      icon: DollarSign,
      link: '/admin/pricing',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
  ]

  const QUICK_LINKS = [
    { label: '+ Шинэ машин нэмэх', to: '/admin/vehicles/new', icon: Car },
    { label: '+ Banner нэмэх', to: '/admin/banners', icon: Image },
    { label: 'Ханш шинэчлэх', to: '/admin/pricing', icon: DollarSign },
    { label: 'Татварын хүснэгт', to: '/admin/tax', icon: FileText },
  ]

  return (
    <div className="p-8">
      {/* Гарчиг */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl">Хяналтын самбар</h1>
          <p className="text-gray-400 text-sm mt-1">SMCar.mn Admin Panel</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded px-3 py-1.5"
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
              className="bg-dark-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                  <p className="text-white text-3xl font-bold">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Хурдан үйлдлүүд */}
      <div className="bg-dark-card border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Хурдан үйлдлүүд</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 bg-dark-secondary hover:bg-gray-750 border border-white/10 hover:border-white/20 rounded-lg px-4 py-3 text-sm text-gray-300 hover:text-white transition-all"
              >
                <Icon size={14} className="text-primary" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Тайлбар */}
      <div className="mt-6 bg-dark-card border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-medium mb-3 text-sm">📋 Хэрхэн ашиглах вэ?</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• <span className="text-white">Banner нэмэх:</span> "Banner зургууд" цэсэнд зураг upload хийхэд нүүр хуудаст автоматаар гарна</p>
          <p>• <span className="text-white">Машин нэмэх:</span> "Машинууд" цэсэнд гараар машины мэдээлэл, зураг оруулна</p>
          <p>• <span className="text-white">Ханш:</span> "Валютын ханш" хэсэгт 1₩ = хэдэн ₮ гэж тохируулна. Тооцоолол автоматаар өөрчлөгдөнө</p>
          <p>• <span className="text-white">Татвар:</span> "Татварын хүснэгт" хэсэгт хөдөлгүүр, насаар татварыг тохируулна</p>
        </div>
      </div>
    </div>
  )
}