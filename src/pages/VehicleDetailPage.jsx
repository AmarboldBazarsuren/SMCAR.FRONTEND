// Файл: frontend/src/pages/VehicleDetailPage.jsx
// Үүрэг: Encar машины дэлгэрэнгүй хуудас + татвар тооцоолол
// Шинэ backend: vehicle.photos[], vehicle.firstPhoto, vehicle.manufacturer, vehicle.displacement гэх мэт

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
        console.log('✅ Машин мэдээлэл ачааллаа:', data.data?.manufacturer, data.data?.model)
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

  // Шинэ backend-ийн өгөгдлийн бүтэц:
  // vehicle.photos[] - бүх зургийн URL жагсаалт
  // vehicle.firstPhoto - үндсэн зураг
  // vehicle.manufacturer, vehicle.model, vehicle.grade
  // vehicle.displacement - хөдөлгүүрийн cc
  // vehicle.fuel - түлшний төрөл
  // vehicle.priceKRW - вон дахь үнэ
  const images = vehicle.photos || (vehicle.firstPhoto ? [vehicle.firstPhoto] : [])
  const title = `${vehicle.manufacturer || ''} ${vehicle.model || ''} ${vehicle.grade || ''}`.trim()

  const specs = [
    { label: 'Он', value: vehicle.year },
    { label: 'Гүйлт', value: vehicle.mileage ? formatMileage(vehicle.mileage) : null },
    { label: 'Хөдөлгүүр', value: vehicle.displacement ? formatCC(vehicle.displacement) : null },
    { label: 'Түлш', value: vehicle.fuel },
    { label: 'Загварын бүлэг', value: vehicle.modelGroup },
    { label: 'Байршил', value: vehicle.officeCityState },
  ].filter(s => s.value)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/vehicles" className="flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Буцах
            </Link>
            <span>/</span>
            <Link to="/" className="hover:text-white">Нүүр хуудас</Link>
            <span>/</span>
            <Link
              to={`/vehicles?manufacturer=${vehicle.manufacturer}`}
              className="hover:text-white"
            >
              {vehicle.manufacturer}
            </Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>

          {/* Encar.com дээрх зарыг харах */}
          <a
            href={`https://www.encar.com/dc/dc_cardetailview.do?carid=${vehicle.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            <span className="font-bold italic">Encar</span> дээрх зарыг харах
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Үндсэн layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Зүүн хэсэг: Зургийн gallery */}
          <div className="lg:col-span-2">
            {/* Үндсэн зураг */}
            <div className="relative bg-dark-card rounded-lg overflow-hidden aspect-[4/3] mb-3">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImg]}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = '' }}
                  />
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
                      {/* Зургийн тоолуур */}
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {activeImg + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  🚗 Зураг байхгүй
                </div>
              )}
            </div>

            {/* Thumbnail зургууд */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Машины нэр + үндсэн спек */}
            <div className="mt-6">
              <h1 className="text-white font-bold text-2xl mb-1">{title}</h1>
              <p className="text-gray-500 text-sm mb-4">ID: {vehicle.id}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {specs.map(s => (
                  <div key={s.label} className="bg-dark-card rounded-lg p-3 border border-white/5">
                    <div className="text-gray-500 text-xs mb-0.5">{s.label}</div>
                    <div className="text-white font-semibold text-sm">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Баруун хэсэг: Үнийн хүснэгт */}
          <div className="lg:col-span-1">
            <PricingBreakdown pricing={pricing} priceKRW={vehicle.priceKRW} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}