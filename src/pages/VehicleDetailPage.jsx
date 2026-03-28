// Файл: frontend/src/pages/VehicleDetailPage.jsx
// Үүрэг: Encar машины дэлгэрэнгүй хуудас + татвар тооцоолол
// Дизайн: Image 5, 6 загвар - зураг, мэдээлэл, үнийн хүснэгт

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import PricingBreakdown from '../components/PricingBreakdown.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEncarVehicleDetail } from '../services/vehicleService.js'
import { formatMileage, formatCC } from '../utils/formatters.js'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    console.log(`🔍 Encar машин дэлгэрэнгүй ачааллаж байна: ID ${id}`)
    setLoading(true)
    setError(null)
    try {
      const data = await getEncarVehicleDetail(id)
      if (data.success) {
        setVehicle(data.data)
        setPricing(data.pricing)
        console.log('✅ Машин мэдээлэл ачааллаа:', data.data?.title)
      } else {
        setError('Машин мэдээлэл татаж чадсангүй')
      }
    } catch (err) {
      console.error('❌ VehicleDetail ачааллахад алдаа:', err.message)
      setError('Машин олдсонгүй эсвэл сервертэй холбогдоход алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <LoadingSpinner text="Машин мэдээлэл ачааллаж байна..." />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-gray-400 mb-6">{error || 'Машин олдсонгүй'}</p>
          <Link to="/vehicles" className="btn-primary">← Жагсаалт руу буцах</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = vehicle.images || (vehicle.image_url ? [vehicle.image_url] : [])
  const title = vehicle.title || `${vehicle.brand} ${vehicle.model}`

  // Машины үндсэн мэдээлэл
  const specs = [
    { label: 'Он', value: vehicle.year },
    { label: 'Гүйлт', value: vehicle.mileage ? formatMileage(vehicle.mileage) : null },
    { label: 'Хөдөлгүүр', value: vehicle.engine_size ? formatCC(parseInt(vehicle.engine_size)) : null },
    { label: 'Хурдны хайрцаг', value: vehicle.transmission },
    { label: 'Түлш', value: vehicle.fuel_type },
    { label: 'Өнгө', value: vehicle.color },
  ].filter(s => s.value)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb - Image 5 загвар */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/vehicles" className="flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Буцах
            </Link>
            <span>/</span>
            <Link to="/" className="hover:text-white">Нүүр хуудас</Link>
            <span>/</span>
            <Link to={`/vehicles?brand=${vehicle.brand}`} className="hover:text-white">{vehicle.brand}</Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>
          {vehicle.encar_url && (
            <a
              href={vehicle.encar_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary text-sm hover:underline"
            >
              <span className="font-bold italic">Encar</span> дээрх зарыг харах
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Үндсэн layout: зураг (зүүн) + үнэ (баруун) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Зүүн хэсэг: Зургийн gallery */}
          <div className="lg:col-span-2">
            {/* Үндсэн зураг */}
            <div className="relative bg-dark-card rounded-lg overflow-hidden aspect-[4/3] mb-3">
              {images.length > 0 ? (
                <>
                  <img
                    src={typeof images[activeImg] === 'string' ? images[activeImg] : images[activeImg]?.url}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = '' }}
                  />
                  {/* Навигация товч */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImg(p => (p + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  🚗 Зураг байхгүй
                </div>
              )}
            </div>

            {/* Thumb зургууд */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.slice(0, 10).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={typeof img === 'string' ? img : img?.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 10 && (
                  <div className="flex-shrink-0 w-20 h-16 rounded bg-dark-card flex items-center justify-center text-gray-400 text-sm border border-white/10">
                    +{images.length - 10}
                  </div>
                )}
              </div>
            )}

            {/* Машины нэр + үндсэн спец */}
            <div className="mt-6">
              <h1 className="text-white font-bold text-2xl mb-3">{title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-6">
                {specs.map(s => (
                  <span key={s.label}>
                    <span className="text-gray-500">{s.label}:</span>{' '}
                    <span className="text-white font-medium">{s.value}</span>
                  </span>
                ))}
              </div>

              {/* Үзлэг оношилгооны мэдээлэл */}
              {vehicle.inspection && (
                <div className="bg-dark-card rounded-lg p-5 border border-white/5">
                  <h3 className="text-white font-semibold mb-3">Үзлэг оношилгооны мэдээлэл</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(vehicle.inspection).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Тайлбар */}
              {vehicle.description && (
                <div className="mt-4 bg-dark-card rounded-lg p-5 border border-white/5">
                  <h3 className="text-white font-semibold mb-2">Тайлбар</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Баруун хэсэг: Үнийн хүснэгт */}
          <div className="lg:col-span-1">
            <PricingBreakdown pricing={pricing} priceKRW={vehicle.price} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}