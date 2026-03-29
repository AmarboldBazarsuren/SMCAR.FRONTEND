// Файл: frontend/src/pages/ManualVehicleDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import PricingBreakdown from '../components/PricingBreakdown.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getManualVehicleDetail } from '../services/vehicleService.js'
import { formatMileage, formatCC } from '../utils/formatters.js'

export default function ManualVehicleDetailPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => { loadVehicle() }, [id])

  const loadVehicle = async () => {
    setLoading(true)
    try {
      const data = await getManualVehicleDetail(id)
      if (data.success) {
        setVehicle(data.data)
        setPricing(data.pricing)
      } else {
        setError('Машин олдсонгүй')
      }
    } catch (err) {
      setError('Машин мэдээлэл татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50"><Navbar /><LoadingSpinner text="Ачааллаж байна..." /></div>
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/vehicles" className="btn-primary">← Буцах</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = vehicle.images || []
  const specs = [
    { label: 'Он', value: vehicle.year },
    { label: 'Гүйлт', value: formatMileage(vehicle.mileage) },
    { label: 'Хөдөлгүүр', value: formatCC(vehicle.engineCC) },
    { label: 'Хурдны хайрцаг', value: vehicle.transmission },
    { label: 'Түлш', value: vehicle.fuelType },
    { label: 'Өнгө', value: vehicle.color },
  ].filter(s => s.value)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/vehicles" className="flex items-center gap-1 hover:text-gray-900">
            <ArrowLeft size={14} />Буцах
          </Link>
          <span>/</span>
          <Link to="/" className="hover:text-gray-900">Нүүр хуудас</Link>
          <span>/</span>
          <span className="text-gray-900">{vehicle.title}</span>
        </div>

        {/* Монголд бэлэн label */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-green-700 text-sm font-medium">Монголд бэлэн зарагдаж байна</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Зүүн: Зурагнууд */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-xl overflow-hidden aspect-[4/3] mb-3 border border-gray-200">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImg]?.url}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImg(p => (p + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">🚗 Зураг байхгүй</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h1 className="text-gray-900 font-bold text-2xl mb-3">{vehicle.title}</h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {specs.map(s => (
                  <div key={s.label} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-gray-400 text-xs mb-0.5">{s.label}</div>
                    <div className="text-gray-900 font-semibold text-sm">{s.value}</div>
                  </div>
                ))}
              </div>

              {vehicle.description && (
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <h3 className="text-gray-900 font-semibold mb-2">Тайлбар</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features?.length > 0 && (
                <div className="mt-4 bg-white rounded-lg p-5 border border-gray-200">
                  <h3 className="text-gray-900 font-semibold mb-3">Онцлог</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((f, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Баруун: Үнийн хүснэгт */}
          <div className="lg:col-span-1">
            <PricingBreakdown
              pricing={pricing}
              priceKRW={vehicle.priceKRW}
              isManual={true}
              vehicleId={vehicle._id}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}